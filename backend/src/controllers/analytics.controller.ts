import { Request, Response } from "express";
import {
  getTopCrimes,
  getCrimeTrends,
  getRiskDistribution,
  getDashboardStats,
} from "../services/analytics.service";

export const analyticsController = async (req: Request, res: Response) => {
  try {
    // 🔥 FIXED USER ACCESS
    const user = (req as any).user;
    const userId: string | undefined = user?.userId;

    // Optional: enforce auth for analytics
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const [topCrimes, trends, risk, stats] = await Promise.all([
      getTopCrimes(userId),
      getCrimeTrends(userId),
      getRiskDistribution(userId),
      getDashboardStats(userId),
    ]);

    res.json({
      success: true,
      data: {
        topCrimes,
        trends,
        riskDistribution: risk,
        stats,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};