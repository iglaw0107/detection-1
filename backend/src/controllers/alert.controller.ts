import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import Alert from '../models/alert.model';

// GET /alerts
export const getAllAlerts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page     = '1',
      limit    = '20',
      status,
      severity,
      cameraId,
      crimeType,
      location,
      startDate,
      endDate,
      sortBy   = 'createdAt',
      order    = 'desc',
    } = req.query;

    const filter: Record<string, any> = {};

    if (status)    filter.status    = status;
    if (severity)  filter.severity  = severity;
    if (cameraId)  filter.cameraId  = cameraId;
    if (crimeType) filter.crimeType = crimeType;
    if (location)  filter.location  = { $regex: location, $options: 'i' };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate)   filter.createdAt.$lte = new Date(endDate   as string);
    }

    const pageNum  = parseInt(page  as string);
    const limitNum = parseInt(limit as string);
    const skip     = (pageNum - 1) * limitNum;

    const [alerts, total] = await Promise.all([
      Alert.find(filter)
        .sort({ [sortBy as string]: order === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limitNum),
      Alert.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// GET /alerts/stats
export const getAlertStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      total,
      active,
      dismissed,
      resolved,
      bySevertiy,
    ] = await Promise.all([
      Alert.countDocuments(),
      Alert.countDocuments({ status: 'active' }),
      Alert.countDocuments({ status: 'dismissed' }),
      Alert.countDocuments({ status: 'resolved' }),
      Alert.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } },
      ]),
    ]);

    const severityMap: Record<string, number> = {};
    bySevertiy.forEach((s) => (severityMap[s._id] = s.count));

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: { active, dismissed, resolved },
        bySeverity: {
          low:    severityMap['low']    || 0,
          medium: severityMap['medium'] || 0,
          high:   severityMap['high']   || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /alerts/:id 
export const getAlertById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alertId = req.params.id as string;
    const alert = await Alert.findOne({ alertId });

    if (!alert) {
      return next(new AppError(`Alert '${req.params.id}' not found`, 404));
    }

    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

// POST /alerts/:id/dismiss 
export const dismissAlert = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return next(new AppError('Reason is required to dismiss an alert', 400));
    }
    const alertId = req.params.id as string;

    const alert = await Alert.findOne({ alertId});

    if (!alert) {
      return next(new AppError(`Alert '${req.params.id}' not found`, 404));
    }

    if (alert.status !== 'active') {
      return next(
        new AppError(`Alert is already ${alert.status}`, 400)
      );
    }

    alert.status      = 'dismissed';
    alert.reason      = reason;
    alert.dismissedBy = req.user?.userId as string;
    alert.dismissedAt = new Date();
    await alert.save();

    res.status(200).json({
      success: true,
      message: 'Alert dismissed',
      data:    alert,
    });
  } catch (error) {
    next(error);
  }
};

// POST /alerts/:id/resolve
export const resolveAlert = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { actionTaken } = req.body;

    if (!actionTaken) {
      return next(new AppError('actionTaken is required to resolve an alert', 400));
    }

    const alertId = req.params.id as string;

    const alert = await Alert.findOne({ alertId });

    if (!alert) {
      return next(new AppError(`Alert '${req.params.id}' not found`, 404));
    }

    if (alert.status === 'resolved') {
      return next(new AppError('Alert is already resolved', 400));
    }

    alert.status      = 'resolved';
    alert.actionTaken = actionTaken;
    alert.resolvedBy  = req.user?.userId as string;
    alert.resolvedAt  = new Date();
    await alert.save();

    res.status(200).json({
      success: true,
      message: 'Alert resolved',
      data:    alert,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /alerts/:id 
// Admin only — hard delete
export const deleteAlert = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alertId = req.params.id as string;
    const alert = await Alert.findOneAndDelete({ alertId });

    if (!alert) {
      return next(new AppError(`Alert '${req.params.id}' not found`, 404));
    }

    res.status(200).json({
      success: true,
      message: `Alert '${req.params.id}' deleted`,
    });
  } catch (error) {
    next(error);
  }
};