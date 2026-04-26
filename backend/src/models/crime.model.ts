import mongoose, { Schema, Document } from "mongoose";

export type CrimeType =
  | "theft"
  | "violence"
  | "trespassing"
  | "vandalism"
  | "suspicious"
  | "robbery"
  | "assault"
  | "unknown"; // 🔥 added for prediction fallback

export type Severity = "low" | "medium" | "high";

export interface ICrimeEvent extends Document {
  // 🔹 SYSTEM
  crimeId: string;

  // 🔹 USER (NEW)
  userId?: string;

  // 🔹 CAMERA (OPTIONAL NOW)
  cameraId?: string;

  // 🔹 COMMON
  location: string;

  // 🔹 AI OUTPUT (NEW)
  predictedCrime?: CrimeType;
  riskLevel?: Severity;

  // 🔹 DETECTION (OPTIONAL)
  crimeType?: CrimeType;
  severity?: Severity;
  confidenceScore?: number;

  // 🔹 TIME
  date: string;
  time: string;

  // 🔹 MEDIA
  videoClipUrl?: string;
  thumbnailUrl?: string;

  // 🔹 AI
  aiSummary?: string;

  // 🔹 EXTRA
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

    // 🔥 NEW (USER SUPPORT)
    userId: {
      type: String,
    },

    cameraId: {
      type: String,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    // 🔥 NEW (AI PREDICTION)
    predictedCrime: {
      type: String,
      enum: [
        "theft",
        "violence",
        "trespassing",
        "vandalism",
        "suspicious",
        "robbery",
        "assault",
        "unknown",
      ],
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
    },

    // 🔹 DETECTION (optional)
    crimeType: {
      type: String,
      enum: [
        "theft",
        "violence",
        "trespassing",
        "vandalism",
        "suspicious",
        "robbery",
        "assault",
      ],
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
    },

    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    videoClipUrl: { type: String },
    thumbnailUrl: { type: String },

    aiSummary: { type: String },

    tags: { type: [String], default: [] },

    isSaved: { type: Boolean, default: false },

    savedBy: { type: String },
    savedRemarks: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🔥 INDEXES
CrimeSchema.index({ crimeType: 1, severity: 1, date: -1 });
CrimeSchema.index({ predictedCrime: 1, riskLevel: 1 });
CrimeSchema.index({ cameraId: 1 });
CrimeSchema.index({ userId: 1 }); // 🔥 NEW
CrimeSchema.index({ location: "text" });

export default mongoose.model<ICrimeEvent>("CrimeEvent", CrimeSchema);