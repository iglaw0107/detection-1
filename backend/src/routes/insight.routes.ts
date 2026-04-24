import express from "express";
import { getInsights } from "../controllers/insight.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getInsights);

export default router;