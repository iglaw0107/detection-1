import { Request, Response } from "express";
import { predictCrime } from "../services/aiModel.service";
import Crime from "../models/crime.model";

export const preditionCrime = async (req: Request, res: Response) => {
  try {
    const location = String(req.body.location || "").trim();
    const time = String(req.body.time || "").trim();

    // ✅ Validation
    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    // 🔥 Call AI
    const aiData = await predictCrime({
      location,
      time,
      weapon_used: req.body.weapon_used || "unknown",
    });

    // 🔥 SAFE USER ACCESS (FIXED)
    const user = (req as any).user;

    // 🔹 Save only if logged in
    if (user?.userId) {
      await Crime.create({
        crimeId: `pred-${Date.now()}`,
        userId: user.userId,
        location,

        predictedCrime: aiData.predicted_crime || "unknown",
        riskLevel: aiData.risk_level || "low",
        aiSummary: aiData.aiSummary || "",

        date: new Date().toISOString().split("T")[0] as string,
        time: time || "12:00",
      });
    }

    // ✅ Response
    res.json({
      success: true,
      data: aiData,
    });

  } catch (error) {
    console.error("Prediction Error:", error);

    res.status(500).json({
      success: false,
      message: "AI prediction failed",
    });
  }
};