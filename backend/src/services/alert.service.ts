import Alert from "../models/alert.model";

export const createAlertForCrime = async ({
  crimeId,
  cameraId,
  location,
  crimeType,
  severity,
}: {
  crimeId: string;
  cameraId: string;
  location: string;
  crimeType: string;
  severity: "low" | "medium" | "high";
}) => {
  try {
    const message = `${crimeType.toUpperCase()} detected at ${location}`;

    const alert = await Alert.create({
      alertId: `alert-${Date.now()}`,
      crimeId,
      cameraId,
      location,
      crimeType, // ✅ REQUIRED
      severity,
      message,

      // ✅ OPTIONAL (good practice)
      status: "active",
      sentVia: ["websocket"],
    });

    return alert;

  } catch (error) {
    console.error("Alert Creation Error:", error);
    throw new Error("Failed to create alert");
  }
};