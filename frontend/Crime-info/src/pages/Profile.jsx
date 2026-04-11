import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Profile">
      <div className="p-6 bg-[#111118] rounded-xl border border-white/10">
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <p className="text-gray-400">{user?.email}</p>
        <p className="text-gray-500">Role: {user?.role}</p>
      </div>
    </DashboardLayout>
  );
}