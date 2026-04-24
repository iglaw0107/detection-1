import { Request, Response } from "express";
import axios from "axios";

const AI_BASE_URL = process.env.AI_MODEL_URL || "http://localhost:5001";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

export const getInsights = async (req: Request, res: Response) => {
  try {
    const { location = "India" } = req.query;

    // ================================
    // 1. CALL AI MODEL
    // ================================
    const [riskRes, hotspotRes] = await Promise.all([
      axios.post(`${AI_BASE_URL}/area-risk`, { city: location }),
      axios.post(`${AI_BASE_URL}/predict-hotspot`, { city: location }),
    ]);

    const riskData = riskRes.data || {};
    const hotspotData = hotspotRes.data || {};

    // ================================
    // 2. CALL NEWS API
    // ================================
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 2);

    const newsRes = await axios.get(
      `https://newsapi.org/v2/everything?q=(crime OR robbery OR murder OR theft) AND ${location}&from=${fromDate
        .toISOString()
        .split("T")[0]}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`
    );

    const news = newsRes.data?.articles || [];

    // ================================
    // 3. FINAL RESPONSE
    // ================================
    return res.json({
      success: true,
      data: {
        location,
        risk: riskData,
        hotspots: hotspotData?.data?.hotspots || [],
        news,
      },
    });

  } catch (error: any) {
        console.error("🔥 INSIGHTS FULL ERROR:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });

        return res.status(500).json({
            success: false,
            message: "Failed to fetch insights",
        });
        }
};