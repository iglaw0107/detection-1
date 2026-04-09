import mongoose, { Schema, Document } from 'mongoose';

export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertStatus   = 'active' | 'dismissed' | 'resolved';

export interface IAlert extends Document {
  alertId:      string;
  crimeId:      string;
  cameraId:     string;
  location:     string;
  crimeType:    string;
  severity:     AlertSeverity;
  status:       AlertStatus;
  sentVia:      string[];
  message:      string;
  reason?:      string;       // filled when dismissed
  actionTaken?: string;       // filled when resolved
  resolvedBy?:  string;       // userId who resolved
  resolvedAt?:  Date;
  dismissedBy?: string;
  dismissedAt?: Date;
  createdAt:    Date;
  updatedAt:    Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    alertId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    crimeId: {
      type:     String,
      required: [true, 'Crime ID is required'],
    },
    cameraId: {
      type:     String,
      required: [true, 'Camera ID is required'],
    },
    location: {
      type:     String,
      required: [true, 'Location is required'],
    },
    crimeType: {
      type:     String,
      required: [true, 'Crime type is required'],
    },
    severity: {
      type:    String,
      enum:    ['low', 'medium', 'high'],
      required: true,
    },
    status: {
      type:    String,
      enum:    ['active', 'dismissed', 'resolved'],
      default: 'active',
    },
    sentVia: {
      type:    [String],
      default: ['websocket'],
    },
    message: {
      type:     String,
      required: [true, 'Alert message is required'],
    },
    reason:      { type: String },
    actionTaken: { type: String },
    resolvedBy:  { type: String },
    resolvedAt:  { type: Date },
    dismissedBy: { type: String },
    dismissedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Fast lookup indexes
AlertSchema.index({ status: 1, severity: 1 });
AlertSchema.index({ crimeId: 1 });
AlertSchema.index({ cameraId: 1 });

export default mongoose.model<IAlert>('Alert', AlertSchema);