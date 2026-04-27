import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function LiveCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [streaming, setStreaming] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // 🎥 START CAMERA
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = stream;
    setStreaming(true);
  };

  // 📡 SEND FRAME TO BACKEND
  const sendFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg");

    socket.emit("video-frame", image);
  };

  // 🔁 LOOP EVERY 2s
  useEffect(() => {
    if (!streaming) return;

    const interval = setInterval(sendFrame, 2000);
    return () => clearInterval(interval);
  }, [streaming]);

  // 📥 RECEIVE ALERTS
  useEffect(() => {
    socket.on("crime-alert", (data) => {
      setAlerts((prev) => [data, ...prev]);
    });

    return () => socket.off("crime-alert");
  }, []);

  return (
    <DashboardLayout title="Live Camera Surveillance">

      <div className="grid lg:grid-cols-2 gap-6">

        {/* LEFT: CAMERA */}
        <div className="bg-[#111118] p-4 rounded-xl">

          <video
            ref={videoRef}
            autoPlay
            className="w-full rounded"
          />

          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="hidden"
          />

          <button
            onClick={startCamera}
            className="mt-4 bg-purple-600 px-4 py-2 rounded"
          >
            Start Camera
          </button>
        </div>

        {/* RIGHT: ALERTS */}
        <div className="bg-[#111118] p-4 rounded-xl">

          <h3 className="text-white mb-3">🚨 Live Alerts</h3>

          {alerts.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No alerts yet
            </p>
          ) : (
            alerts.map((a, i) => (
              <div
                key={i}
                className="mb-3 p-3 bg-black/30 rounded"
              >
                <p className="text-white">{a.crimeType}</p>
                <p className="text-xs text-gray-400">
                  {a.severity}
                </p>
              </div>
            ))
          )}

        </div>
      </div>

    </DashboardLayout>
  );
}