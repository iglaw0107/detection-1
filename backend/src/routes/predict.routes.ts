import express from "express";
import { preditionCrime } from "../controllers/predict.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/predict-crime", protect, preditionCrime);

export default router;