import { v4 as uuidv4 } from "uuid";
import CrimeEvent from "../models/crime.model";
import Camera from "../models/camera.model";
import { createAlertForCrime } from "./alert.service";
import { Express } from "express";

// 🔹 TYPE
interface DetectedEvent {
  crimeType?: string;
  severity?: "low" | "medium" | "high";
  confidenceScore?: number;
  timestampInVideo?: string;
  thumbnailUrl?: string;
  aiSummary?: string;
}

// 🔥 MAIN FUNCTION
export const saveDetectedCrimes = async (
  detectedEvents: DetectedEvent[],
  cameraId: string,
  location: string,
  file: Express.Multer.File
): Promise<any[]> => {
  const now = new Date();

  const dateStr = now.toISOString().split("T")[0] as string;
  const timeStr = now.toTimeString().split(" ")[0] as string;

  const savedCrimes = await Promise.all(
    detectedEvents.map(async (event) => {
      // 🔥 SAFE DEFAULTS (fixes TypeScript issues)
      const crimeType = event.crimeType || "suspicious";
      const severity = event.severity || "medium";
      const confidenceScore = event.confidenceScore || 0.5;

      const crime = await CrimeEvent.create({
        crimeId: `crm_${uuidv4().split("-")[0]}`,
        cameraId,
        location,

        crimeType,
        severity,
        confidenceScore,

        date: dateStr,
        time: event.timestampInVideo || timeStr,

        videoClipUrl: `/uploads/videos/${file.filename}`,
        thumbnailUrl: event.thumbnailUrl || "",

        aiSummary: event.aiSummary || "",

        tags: [crimeType, "auto-detected"],
      } as any);

      // 🔥 CREATE ALERT (FIXED)
      await createAlertForCrime({
        crimeId: crime.crimeId,
        cameraId,
        location,
        crimeType,
        severity,
      });

      return crime;
    })
  );

  // 🔥 UPDATE CAMERA LAST ACTIVE
  await Camera.findOneAndUpdate(
    { cameraId },
    { lastActive: new Date() }
  );

  return savedCrimes;
};