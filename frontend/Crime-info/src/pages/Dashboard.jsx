import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import CrimeTrendChart from "../components/charts/CrimeTrendChart";
import SeverityPieChart from "../components/charts/SeverityPieChart";
import AISummaryBox from "../components/ui/AISummaryBox";
import { ShieldAlert, Camera, Bell } from "lucide-react";

export default function Dashboard() {
  const trends = [
    { month: "Jan", crimes: 120 },
    { month: "Feb", crimes: 90 },
    { month: "Mar", crimes: 150 },
  ];

  const severity = [
    { name: "Critical", value: 15 },
    { name: "High", value: 25 },
    { name: "Medium", value: 35 },
    { name: "Low", value: 20 },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={ShieldAlert} label="Crimes Today" value={42} />
        <StatCard icon={Camera} label="Active Cameras" value={120} />
        <StatCard icon={Bell} label="Active Alerts" value={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CrimeTrendChart data={trends} />
        <SeverityPieChart data={severity} />
      </div>

      <div className="mt-6">
        <AISummaryBox
          title="AI Daily Summary"
          content="Crime activity increased by 12% compared to yesterday."
        />
      </div>
    </DashboardLayout>
  );
}