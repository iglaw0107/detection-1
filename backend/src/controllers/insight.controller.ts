import { Request, Response } from "express";
import {
  getAreaRisk,
  predictHotspots,
} from "../services/aiModel.service";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export const getInsights = async (req: Request, res: Response) => {
  try {
    const { location = "India" } = req.query;

    
    const [riskData, hotspotData] = await Promise.all([
      getAreaRisk({ city: location }),
      predictHotspots({ city: location }),
    ]);

    return res.json({
      success: true,
      data: {
        location,
        risk: riskData,
        hotspots: hotspotData?.data?.hotspots || [],
      },
    });

  } catch (error: any) {
    console.error("INSIGHTS ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch insights",
    });
  }
};