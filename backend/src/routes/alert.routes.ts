import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import {
  getAllAlerts,
  getAlertStats,
  getAlertById,
  dismissAlert,
  resolveAlert,
  deleteAlert,
} from '../controllers/alert.controller';

const router = Router();

// Stats — before /:id to avoid conflict
router.get('/stats', protect, getAlertStats);

// Read — any authenticated user
router.get('/',    protect, getAllAlerts);
router.get('/:id', protect, getAlertById);

// Actions — police + admin
router.post('/:id/dismiss', protect, authorize('admin', 'police'), dismissAlert);
router.post('/:id/resolve', protect, authorize('admin', 'police'), resolveAlert);

// Delete — admin only
router.delete('/:id', protect, authorize('admin'), deleteAlert);

export default router;