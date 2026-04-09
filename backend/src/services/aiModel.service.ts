import axios from 'axios';

const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:5001';

export interface PredictionResult {
  predicted_crime: string;
  probability: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
  input_summary: {
    location: string;
    time: string;
    weapon_used: string;
  };
}

export interface DetectionResult {
  crimeType: string;
  severity: string;
  confidenceScore: number;
  timestampInVideo: string;
  thumbnailUrl?: string;
  aiSummary?: string;        // Gemini summary comes FROM Python
  recommendation?: string;
}

// ── Hit Python /predict-crime endpoint ──────────────────────────
export const predictCrime = async (payload: {
  location: string;
  time: string;
  victim_age?: number;
  victim_gender?: string;
  weapon_used?: string;
  crime_domain?: string;
  police_deployed?: number;
}): Promise<PredictionResult> => {
  try {
    const response = await axios.post(
      `${AI_MODEL_URL}/predict-crime`,
      payload,
      { timeout: 30000 }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `AI Model error: ${error.response?.data?.error || error.message}`
    );
  }
};

// ── Hit Python /detect endpoint (video detection) ───────────────
export const runVideoDetection = async (
  videoPath: string,
  cameraId: string,
  location: string
): Promise<DetectionResult[]> => {
  try {
    const response = await axios.post(
      `${AI_MODEL_URL}/detect`,
      { videoPath, cameraId, location },
      { timeout: 120000 } // 2 min for video
    );
    return response.data.detectedEvents || [];
  } catch (error: any) {
    // Dev fallback if Python not running
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  AI Model not running, using mock data');
      return [
        {
          crimeType: 'suspicious',
          severity: 'medium',
          confidenceScore: 0.82,
          timestampInVideo: '00:01:23',
          aiSummary: 'Mock: Suspicious activity detected near entrance.',
          recommendation : 'Stay alert and avoid isolated areas.',
        },
      ];
    }
    throw new Error(`AI Model error: ${error.message}`);
  }
};