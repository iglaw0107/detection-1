import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";

export default function AdminCameras() {
  const [cameras, setCameras] = useState([]);
  const [form, setForm] = useState({
    cameraId: "",
    location: "",
    ipAddress: "",
    installationDate: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // 🚨 ADMIN CHECK
  if (user?.role !== "admin") {
    return (
      <DashboardLayout title="Access Denied">
        <p className="text-red-400">Only admin can access this page</p>
      </DashboardLayout>
    );
  }

  // 📸 FETCH CAMERAS
  const fetchCameras = async () => {
    try {
      const res = await api.get("/cameras");
      setCameras(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  // ➕ CREATE CAMERA
  const handleCreate = async () => {
    try {
      await api.post("/cameras", form);
      setForm({
        cameraId: "",
        location: "",
        ipAddress: "",
        installationDate: "",
      });
      fetchCameras();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating camera");
    }
  };

  // 🔄 TOGGLE STATUS
  const toggleStatus = async (cam) => {
    try {
      await api.patch(`/cameras/${cam.cameraId}/status`, {
        status: cam.status === "active" ? "inactive" : "active",
      });
      fetchCameras();
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ DELETE CAMERA
  const handleDelete = async (id) => {
    if (!confirm("Delete this camera?")) return;

    try {
      await api.delete(`/cameras/${id}`);
      fetchCameras();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Admin Camera Panel">

      {/* 🔥 CREATE CAMERA */}
      <div className="bg-[#111118] p-5 rounded-xl border border-white/10 mb-6">
        <h3 className="text-white mb-3">➕ Add Camera</h3>

        <div className="grid md:grid-cols-4 gap-3">
          <input
            placeholder="Camera ID"
            value={form.cameraId}
            onChange={(e) =>
              setForm({ ...form, cameraId: e.target.value })
            }
            className="bg-black/30 p-2 rounded text-white"
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="bg-black/30 p-2 rounded text-white"
          />

          <input
            placeholder="IP Address"
            value={form.ipAddress}
            onChange={(e) =>
              setForm({ ...form, ipAddress: e.target.value })
            }
            className="bg-black/30 p-2 rounded text-white"
          />

          <input
            type="date"
            value={form.installationDate}
            onChange={(e) =>
              setForm({
                ...form,
                installationDate: e.target.value,
              })
            }
            className="bg-black/30 p-2 rounded text-white"
          />
        </div>

        <button
          onClick={handleCreate}
          className="mt-4 bg-purple-600 px-4 py-2 rounded"
        >
          Add Camera
        </button>
      </div>

      {/* 📋 CAMERA TABLE */}
      <div className="bg-[#111118] p-5 rounded-xl border border-white/10">
        <h3 className="text-white mb-3">📸 Cameras</h3>

        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="text-gray-500">
              <th>ID</th>
              <th>Location</th>
              <th>Status</th>
              <th>IP</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cameras.map((cam) => (
              <tr key={cam._id} className="border-t border-white/10">

                <td>{cam.cameraId}</td>
                <td>{cam.location}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      cam.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {cam.status}
                  </span>
                </td>

                <td>{cam.ipAddress}</td>

                <td className="flex gap-2">

                  <button
                    onClick={() => toggleStatus(cam)}
                    className="text-xs px-2 py-1 bg-blue-600 rounded"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => handleDelete(cam.cameraId)}
                    className="text-xs px-2 py-1 bg-red-600 rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </DashboardLayout>
  );
}