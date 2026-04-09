import mongoose, { Schema, Document } from 'mongoose';

export type CrimeType =
  | 'theft'
  | 'violence'
  | 'trespassing'
  | 'vandalism'
  | 'suspicious'
  | 'robbery'
  | 'assault';

export type Severity = 'low' | 'medium' | 'high';

export interface ICrimeEvent extends Document {
  crimeId: string;
  cameraId: string;
  location: string;
  crimeType: CrimeType;
  severity: Severity;
  confidenceScore: number;
  date: string;
  time: string;
  videoClipUrl?: string;
  thumbnailUrl?: string;
  aiSummary?: string;
  tags: string[];
  isSaved: boolean;
  savedBy?: string;
  savedRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CrimeSchema = new Schema<ICrimeEvent>(
  {
    crimeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cameraId: {
      type: String,
      required: [true, 'Camera ID is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    crimeType: {
      type: String,
      enum: ['theft','violence','trespassing','vandalism','suspicious','robbery','assault'],
      required: [true, 'Crime type is required'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: [true, 'Severity is required'],
    },
    confidenceScore: {
      type: Number,
      required: [true, 'Confidence score is required'],
      min: [0, 'Score must be >= 0'],
      max: [1, 'Score must be <= 1'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    videoClipUrl: { type: String },
    thumbnailUrl:  { type: String },
    aiSummary:     { type: String },
    tags:          { type: [String], default: [] },
    isSaved:       { type: Boolean, default: false },
    savedBy:       { type: String },
    savedRemarks:  { type: String },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for fast filtering
CrimeSchema.index({ crimeType: 1, severity: 1, date: -1 });
CrimeSchema.index({ cameraId: 1 });
CrimeSchema.index({ location: 'text' });

export default mongoose.model<ICrimeEvent>('CrimeEvent', CrimeSchema);