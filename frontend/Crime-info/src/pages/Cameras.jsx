import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCameras } from "../api/cameras";
import StatCard from "../components/ui/StatCard";
import { Camera } from "lucide-react";

export default function Cameras() {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    getCameras()
      .then((res) => {
        const data = res?.data;

        // ✅ ensure it's always an array (no crash)
        if (Array.isArray(data)) {
          setCameras(data);
        } else if (Array.isArray(data?.data)) {
          setCameras(data.data);
        } else if (Array.isArray(data?.cameras)) {
          setCameras(data.cameras);
        } else {
          setCameras([]); // fallback
        }
      })
      .catch(() => {
        setCameras([]); // ✅ prevent crash on API error
      });
  }, []);

  return (
    <DashboardLayout title="Cameras">
      <StatCard icon={Camera} label="Total Cameras" value={cameras.length} />

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {Array.isArray(cameras) &&
          cameras.map((cam) => (
            <div
              key={cam._id}
              className="p-4 bg-[#111118] border border-white/5 rounded-xl"
            >
              <p className="text-white font-semibold">{cam.name}</p>
              <p className="text-gray-400 text-sm">{cam.location}</p>
            </div>
          ))}
      </div>
    </DashboardLayout>
  );
}