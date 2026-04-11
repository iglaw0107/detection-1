import DashboardLayout from "../components/layout/DashboardLayout";
import CrimeTrendChart from "../components/charts/CrimeTrendChart";
import SeverityPieChart from "../components/charts/SeverityPieChart";

export default function Analytics() {
  const trends = [
    { month: "Jan", crimes: 120 },
    { month: "Feb", crimes: 95 },
    { month: "Mar", crimes: 150 },
  ];

  const severity = [
    { name: "Critical", value: 20 },
    { name: "High", value: 30 },
    { name: "Medium", value: 40 },
    { name: "Low", value: 10 },
  ];

  return (
    <DashboardLayout title="Analytics">
      <CrimeTrendChart data={trends} />
      <div className="mt-6">
        <SeverityPieChart data={severity} />
      </div>
    </DashboardLayout>
  );
}