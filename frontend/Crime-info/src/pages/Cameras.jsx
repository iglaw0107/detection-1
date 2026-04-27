import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCameras } from "../api/camera.api";
import {
  getAlerts,
  resolveAlert,
  dismissAlert,
} from "../api/alerts.api";
import StatCard from "../components/ui/StatCard";
import { Camera, AlertTriangle, Activity } from "lucide-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// 🔥 USE SAFE PUBLIC VIDEOS (NO YOUTUBE ISSUES)
const VIDEO_FEEDS = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://www.w3schools.com/html/movie.mp4",
];

export default function Cameras() {
  const [cameras, setCameras] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const videoRef = useRef(null);

  // 📸 Fetch cameras
  useEffect(() => {
    getCameras().then((res) => {
      const data = res?.data?.data || res?.data || [];
      setCameras(data);
    });
  }, []);

  // 🚨 Fetch alerts
  useEffect(() => {
    getAlerts().then((res) => {
      setAlerts(res?.data?.data || []);
    });
  }, []);

  // 🚨 Socket alerts
  useEffect(() => {
    socket.on("new-alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    return () => socket.off("new-alert");
  }, []);

  // 🎥 Fake frame sender
  useEffect(() => {
    if (!selectedCamera) return;

    const interval = setInterval(() => {
      socket.emit("frame", {
        cameraId: selectedCamera.cameraId,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedCamera]);

  // actions
  const handleResolve = async (id) => {
    await resolveAlert(id, { actionTaken: "Handled" });
    setAlerts((prev) =>
      prev.map((a) =>
        a.alertId === id ? { ...a, status: "resolved" } : a
      )
    );
  };

  const handleDismiss = async (id) => {
    await dismissAlert(id, { reason: "False alarm" });
    setAlerts((prev) =>
      prev.map((a) =>
        a.alertId === id ? { ...a, status: "dismissed" } : a
      )
    );
  };

  return (
    <DashboardLayout title="Cameras">

      {/* 🔥 STATS */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Camera} label="Cameras" value={cameras.length} />
        <StatCard icon={AlertTriangle} label="Alerts" value={alerts.length} />
        <StatCard icon={Activity} label="Active Feed" value={selectedCamera ? 1 : 0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">

        {/* 📸 CAMERA LIST */}
        <div className="bg-[#111118] p-4 rounded-xl border border-white/10">
          <h3 className="text-white mb-3">Cameras</h3>

          {cameras.map((cam, i) => (
            <div
              key={cam._id}
              onClick={() => setSelectedCamera({ ...cam, index: i })}
              className="p-3 mb-2 cursor-pointer border rounded bg-black/30 hover:bg-white/5"
            >
              <p className="text-white">{cam.cameraId}</p>
              <p className="text-xs text-gray-400">{cam.location}</p>
            </div>
          ))}
        </div>

        {/* 🎥 LIVE FEED */}
        <div className="lg:col-span-2 bg-[#111118] p-4 rounded-xl border border-white/10">

          {!selectedCamera ? (
            <div className="h-[420px] flex items-center justify-center text-gray-400 border border-white/10 rounded">
              Select a camera
            </div>
          ) : (
            <div className="relative w-full h-[420px] rounded-xl overflow-hidden border border-white/10 bg-black">

              {/* ✅ ALWAYS WORKING VIDEO */}
              <video
                key={selectedCamera.index}
                src={VIDEO_FEEDS[selectedCamera.index % VIDEO_FEEDS.length]}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />

              {/* 🔴 OVERLAY */}
              <div className="absolute top-2 left-3 flex justify-between w-full pr-4 text-xs text-white">

                <span className="bg-black/60 px-2 py-1 rounded">
                  CAM {selectedCamera.cameraId} — {selectedCamera.location}
                </span>

                <span className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  REC
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🚨 ALERTS */}
      <div className="mt-6 bg-[#111118] p-4 rounded-xl border border-white/10">
        <h3 className="text-white mb-3">Live Alerts</h3>

        {alerts.map((alert) => (
          <div key={alert.alertId} className="p-3 mb-2 bg-black/30 rounded">

            <p className="text-white">{alert.crimeType}</p>
            <p className="text-xs text-gray-400">{alert.location}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleResolve(alert.alertId)}
                className="text-xs px-2 py-1 bg-green-600 rounded"
              >
                ✓
              </button>

              <button
                onClick={() => handleDismiss(alert.alertId)}
                className="text-xs px-2 py-1 bg-yellow-600 rounded"
              >
                ✕
              </button>
            </div>

          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}