import { Request, Response } from "express";
import {
  getTopCrimes,
  getCrimeTrends,
  getRiskDistribution,
  getDashboardStats,
} from "../services/analytics.service";

export const analyticsController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId: string | undefined = user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 NEW: GET LOCATION FROM QUERY
    const location = req.query.location as string | undefined;

    const [topCrimes, trends, risk, stats] = await Promise.all([
      getTopCrimes(userId, location),
      getCrimeTrends(userId, location),
      getRiskDistribution(userId, location),
      getDashboardStats(userId, location),
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