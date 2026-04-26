import express from "express";
import { preditionCrime } from "../controllers/predict.controller";
import {
  getCrimeHotspots,
  getCrimeTrends,
} from "../controllers/crime.controller";

const router = express.Router();

// 🔓 Public AI routes
router.post("/predict", preditionCrime);
router.get("/hotspots", getCrimeHotspots);
router.get("/trends", getCrimeTrends);

export default router;