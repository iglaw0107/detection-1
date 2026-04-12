import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { protect, authorize } from '../middleware/auth.middleware';
import {
  getAllCrimes,
  getCrimeStats,
  getCrimeById,
  detectCrime,
  createManualCrime,
  saveCrime,
  deleteCrime,
    getCrimeHotspots,
    getCrimeTrends,
    getCrimeAreaRisk,
} from '../controllers/crime.controller';

// ── Multer config for video uploads ──────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/videos/'),
  filename: (req, file, cb) =>
    cb(null, `vid_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.avi', '.mkv', '.mov'];
    allowed.includes(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(new Error('Only video files allowed: mp4, avi, mkv, mov'));
  },
});

const router = Router();

// ── All specific named routes FIRST ────────────────

// Stats
router.get('/stats', protect, getCrimeStats);

// AI analysis routes
router.get('/hotspots', protect, getCrimeHotspots);
router.get('/trends', protect, getCrimeTrends);
router.get('/area-risk', protect, getCrimeAreaRisk);

// Detection & manual entry
router.post(
  '/detect',
  protect,
  authorize('admin', 'police'),
  upload.single('video'),
  detectCrime
);

router.post(
  '/manual',
  protect,
  authorize('admin', 'police'),
  createManualCrime
);

// ── Generic routes AFTER named routes ──────────────
router.get('/', protect, getAllCrimes);
router.get('/:id', protect, getCrimeById); // ✅ now safe

// ── Sub-resource routes ────────────────────────────
router.patch('/:id/save', protect, authorize('admin', 'police'), saveCrime);
router.delete('/:id', protect, authorize('admin'), deleteCrime);



export default router;