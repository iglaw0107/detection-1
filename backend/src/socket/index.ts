import { Server } from "socket.io";
import axios from "axios";
import Alert from "../models/alert.model";
import Camera from "../models/camera.model";
import { v4 as uuidv4 } from "uuid";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:10000";

// 🔥 Anti-spam tracker (per camera)
const lastAlertTime: Record<string, number> = {};

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    /**
     * 📡 RECEIVE FRAME EVENT
     * Expected payload:
     * {
     *   cameraId: string,
     *   image?: base64 string (optional)
     * }
     */
    socket.on("frame", async ({ cameraId, image }) => {
      try {
        if (!cameraId) return;

        const now = Date.now();

        // 🔥 Anti-spam (10 sec per camera)
        if (
          lastAlertTime[cameraId] &&
          now - lastAlertTime[cameraId] < 10000
        ) {
          return;
        }

        lastAlertTime[cameraId] = now;

        // 📍 Get camera
        const camera = await Camera.findOne({ cameraId });
        const location = camera?.location || "Unknown";

        // 🔥 CALL AI SERVICE
        let result: any;

        try {
          const res = await axios.post(
            `${AI_URL}/api/v1/predict`,
            {
              location,
              time: new Date().toTimeString().slice(0, 5),
              weapon_used: "unknown",
              image, // 🔥 optional (for real frame-based AI)
            },
            { timeout: 10000 }
          );

          result = res.data;
        } catch (aiError:any) {
          console.error("❌ AI call failed:", aiError.message);

          // fallback result
          result = {
            predicted_crime: "unknown",
            risk_level: "LOW",
            aiSummary: "AI service unavailable",
            probability: 0,
          };
        }

        // 🔥 SAFETY CHECK
        if (!result || !result.risk_level) return;

        // ❗ Ignore LOW risk
        if (result.risk_level === "LOW") return;

        const severity =
          result.risk_level === "HIGH"
            ? "high"
            : result.risk_level === "MEDIUM"
            ? "medium"
            : "low";

        // 🔥 CREATE ALERT
        const alert = await Alert.create({
          alertId: `alt_${uuidv4().split("-")[0]}`,
          crimeId: `crm_${uuidv4().split("-")[0]}`,
          cameraId,
          location,
          crimeType: result.predicted_crime || "unknown",
          severity,
          message:
            result.aiSummary || "Suspicious activity detected",
          sentVia: ["websocket"],
        });

        // 🔥 BROADCAST TO ALL CLIENTS
        io.emit("new-alert", {
          ...alert.toObject(),
          confidence: result.probability || 0,
          timestamp: new Date(),
        });

        // 🔥 SEND RESULT BACK TO SENDER (for UI preview)
        socket.emit("detection", {
          ...result,
          cameraId,
          location,
        });

      } catch (err: any) {
        console.error("❌ Socket error:", err?.message || err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};