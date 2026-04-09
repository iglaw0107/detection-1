import { v4 as uuidv4 } from 'uuid';
import Alert, { IAlert } from '../models/alert.model';

// ─────────────────────────────────────────────────────────────────
//  This function is called automatically from crime.controller.ts
//  whenever a crime with severity 'high' or 'medium' is detected.
//
//  Later when AI model is ready, you can:
//  1. Call Python /generate-alert-message endpoint here
//  2. Replace the hardcoded message with AI generated one
//  3. Add SMS/Email via Twilio/Nodemailer here
// ─────────────────────────────────────────────────────────────────

export const createAlertForCrime = async (crimeData: {
  crimeId:    string;
  cameraId:   string;
  location:   string;
  crimeType:  string;
  severity:   'low' | 'medium' | 'high';
  aiSummary?: string;
}): Promise<IAlert | null> => {

  // Only create alerts for medium and high severity
  if (crimeData.severity === 'low') return null;

  const alertId = `alt_${uuidv4().split('-')[0]}`;

  // ── AI MODEL HOOK (replace this message later) ────────────────
  // TODO: Later replace this with:
  // const message = await callPythonAlertMessage(crimeData);
  const message =
    crimeData.aiSummary ||
    `${crimeData.severity.toUpperCase()} severity ${crimeData.crimeType} detected at ${crimeData.location}.`;
  // ─────────────────────────────────────────────────────────────

  const alert = await Alert.create({
    alertId,
    crimeId:   crimeData.crimeId,
    cameraId:  crimeData.cameraId,
    location:  crimeData.location,
    crimeType: crimeData.crimeType,
    severity:  crimeData.severity,
    status:    'active',
    sentVia:   ['websocket'],   // TODO: add 'sms', 'email' later
    message,
  });

  return alert;
};