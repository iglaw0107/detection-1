import express from "express";
import { preditionCrime } from "../controllers/predict.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/crimes/predict-direct", preditionCrime);

export default router;