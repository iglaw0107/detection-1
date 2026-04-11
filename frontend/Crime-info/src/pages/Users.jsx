import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Users() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <p className="text-red-400">Access denied</p>;
  }

  return (
    <DashboardLayout title="Users">
      <p className="text-gray-300">Manage system users here.</p>
    </DashboardLayout>
  );
}