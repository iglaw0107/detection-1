import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 PROTECT ADMIN
  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user]);

  // 📊 FETCH USERS
  useEffect(() => {
    if (user?.role === "admin") {
      api.get("/auth/users")
        .then((res) => {
          setUsers(res?.data?.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  // ❌ DELETE USER
  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;

    await api.delete(`/auth/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin">
        <p className="text-gray-400">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard">

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-[#111118] p-4 rounded">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-xl font-bold">{users.length}</p>
        </div>

        <div className="bg-[#111118] p-4 rounded">
          <p className="text-gray-400 text-sm">Admins</p>
          <p className="text-xl font-bold">
            {users.filter(u => u.role === "admin").length}
          </p>
        </div>

        <div className="bg-[#111118] p-4 rounded">
          <p className="text-gray-400 text-sm">Police Users</p>
          <p className="text-xl font-bold">
            {users.filter(u => u.role === "police").length}
          </p>
        </div>

      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div className="flex gap-3 mb-6">

        <button
          onClick={() => navigate("/admin/cameras")}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          Manage Cameras
        </button>

        <button
          onClick={() => navigate("/alerts")}
          className="px-4 py-2 bg-yellow-600 rounded"
        >
          View Alerts
        </button>

      </div>

      {/* 👥 USER TABLE */}
      <div className="bg-[#111118] p-5 rounded-xl border border-white/10">
        <h3 className="text-white mb-3">Manage Users</h3>

        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="text-gray-500">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-white/10">
                <td>{u.name}</td>
                <td>{u.email}</td>

                <td>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      u.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(u._id)}
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