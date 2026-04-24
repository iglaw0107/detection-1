import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import CrimeTrendChart from "../components/charts/CrimeTrendChart";
import SeverityPieChart from "../components/charts/SeverityPieChart";
import AISummaryBox from "../components/ui/AISummaryBox";
import { ShieldAlert, Camera, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getCrimeHotspots, getCrimeStats, getCrimeTrends } from "../api/crimes";
import { getCrimes } from "../api/crimes";
import { getCameraStats } from "../api/cameras";
import { getAlertStats } from "../api/alerts";
import { getCrimeNews } from "../api/news";

export default function Dashboard() {
  // const trends = [
  //   { month: "Jan", crimes: 120 },
  //   { month: "Feb", crimes: 90 },
  //   { month: "Mar", crimes: 150 },
  // ];

  // const severity = [
  //   { name: "Critical", value: 15 },
  //   { name: "High", value: 25 },
  //   { name: "Medium", value: 35 },
  //   { name: "Low", value: 20 },
  // ];

  const [trends, setTrends] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [stats, setStats] = useState({
    todayCrimes: 0,
    activeCameras: 0,
    activeAlerts: 0,
  });
  const [hotspots, setHotspots] = useState([]);
  const [todayCrimeList, setTodayCrimeList] = useState([]);
  const [crimeNews, setCrimeNews] = useState([]);

  useEffect(() => {
    getCrimeStats()
      .then((res) => {
        const data = res?.data?.data || {};
        const bySeverity = data?.bySeverity || {};

        setStats((prev) => ({
          ...prev,
          todayCrimes: data?.todayCrimes || 0,
        }));

        setSeverity([
          { name: "High", value: bySeverity.high || 0 },
          { name: "Medium", value: bySeverity.medium || 0 },
          { name: "Low", value: bySeverity.low || 0 },
        ]);
      })
      .catch(() => setSeverity([]));

    getCrimeTrends({ groupBy: "month" })
      .then((res) => {
        const trendRows = res?.data?.data?.trends || [];
        setTrends(
          trendRows.map((t) => ({
            month: t.period || t.month || "N/A",
            crimes: t.totalCrimes || t.count || 0,
          }))
        );
      })
      .catch(() => setTrends([]));

    getCrimeHotspots({ topN: 5 })
      .then((res) => {
        setHotspots(res?.data?.data?.hotspots || []);
      })
      .catch(() => setHotspots([]));

    getCameraStats()
      .then((res) =>
        setStats((prev) => ({
          ...prev,
          activeCameras: res?.data?.data?.active || 0,
        }))
      )
      .catch(() => {});

    getAlertStats()
      .then((res) =>
        setStats((prev) => ({
          ...prev,
          activeAlerts: res?.data?.data?.active || 0,
        }))
      )
      .catch(() => {});

    const today = new Date().toISOString().split("T")[0];
    getCrimes({ startDate: today, endDate: today, limit: 6, sortBy: "time", order: "desc" })
      .then((res) => {
        setTodayCrimeList(res?.data?.data || []);
      })
      .catch(() => setTodayCrimeList([]));
  }, []);
  
  useEffect(() => {
    getCrimeNews()
      .then((res) => {
        console.log("NEWS API RESPONSE:", res.data);
        setCrimeNews(res?.data?.articles || []);
      })
      .catch((err) => {
        console.error("NEWS ERROR:", err);
        setCrimeNews([]);
      });
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <StatCard icon={ShieldAlert} label="Crimes Today" value={42} />
        <StatCard icon={Camera} label="Active Cameras" value={120} />
        <StatCard icon={Bell} label="Active Alerts" value={8} /> */}
        <StatCard icon={ShieldAlert} label="Crimes Today" value={stats.todayCrimes} />
        <StatCard icon={Camera} label="Active Cameras" value={stats.activeCameras} />
        <StatCard icon={Bell} label="Active Alerts" value={stats.activeAlerts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CrimeTrendChart data={trends} />
        <SeverityPieChart data={severity} />
      </div>

      <div className="mt-6">
        <AISummaryBox
          // title="AI Daily Summary"
          // content="Crime activity increased by 12% compared to yesterday."
          title="Today Crime Hotspots"
          content={
            hotspots.length
              ? hotspots
                  .map((h) => `${h.area} (${h.riskLevel} • ${h.mostCommonCrime})`)
                  .join(" | ")
              : "No hotspot predictions available right now."
          }
        />
      </div>

      <div className="mt-6 bg-[#111118] rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-semibold mb-3">📰 Crime News Today</h3>

        {crimeNews.length === 0 ? (
          <p className="text-sm text-gray-400">No news available.</p>
        ) : (
          <div className="space-y-3">
            {crimeNews.slice(0, 5).map((news, index) => (
              <a
                key={index}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-white/10 rounded-lg p-3 bg-black/30 hover:bg-black/50"
              >
                <p className="text-white text-sm font-medium">
                  {news.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {news.source?.name} | {new Date(news.publishedAt).toLocaleTimeString()}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}