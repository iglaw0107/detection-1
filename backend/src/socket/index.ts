import { Server } from "socket.io";
import axios from "axios";
import Alert from "../models/alert.model";
import Camera from "../models/camera.model";
import { v4 as uuidv4 } from "uuid";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:10000";

const lastAlertTime: Record<string, number> = {};

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("frame", async ({ cameraId }) => {
      try {
        const now = Date.now();

        // 🔥 Anti-spam (10 sec per camera)
        if (
          lastAlertTime[cameraId] &&
          now - lastAlertTime[cameraId] < 10000
        ) {
          return;
        }
        lastAlertTime[cameraId] = now;

        // 📍 Get camera info
        const camera = await Camera.findOne({ cameraId });

        const location = camera?.location || "Unknown";

        // 🔥 CALL YOUR AI MODEL (UPDATED)
        const res = await axios.post(
          `${AI_URL}/api/v1/predict`,
          {
            location,
            time: new Date().toTimeString().slice(0, 5),
            weapon_used: "unknown",
          },
          { timeout: 10000 }
        );

        const result = res.data;

        // ❗ Ignore low-risk alerts
        if (result.risk_level === "LOW") return;

        const severity =
          result.risk_level === "HIGH"
            ? "high"
            : result.risk_level === "MEDIUM"
            ? "medium"
            : "low";

        const alert = await Alert.create({
          alertId: `alt_${uuidv4().split("-")[0]}`,
          crimeId: `crm_${uuidv4().split("-")[0]}`,
          cameraId,
          location,
          crimeType: result.predicted_crime || "unknown",
          severity,
          message: result.aiSummary || "Suspicious activity detected",
          sentVia: ["websocket"],
        });

        // 🔥 BROADCAST TO ALL CLIENTS
        io.emit("new-alert", alert);

        // 🔥 SEND BACK TO SENDER
        socket.emit("detection", result);

      } catch (err: any) {
        console.error("Socket error:", err?.message || err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};