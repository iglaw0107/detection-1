import express from "express";
import { protect } from "../middleware/auth.middleware";
import Crime from "../models/crime.model";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    // 🔥 FIXED USER ACCESS
    const user = (req as any).user;

    if (!user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const crimes = await Crime.find({
      userId: user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: crimes,
    });

  } catch (error) {
    console.error("History Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
});

export default router;