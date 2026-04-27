// import DashboardLayout from "../components/layout/DashboardLayout";
// import StatCard from "../components/ui/StatCard";
// import CrimeTrendChart from "../components/charts/CrimeTrendChart";
// import SeverityPieChart from "../components/charts/SeverityPieChart";
// import AISummaryBox from "../components/ui/AISummaryBox";
// import { ShieldAlert, Camera, Bell } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getCrimeHotspots, getCrimeStats, getCrimeTrends } from "../api/crime.api";
// import { getCrimes } from "../api/crime.api";
// import { getCameraStats } from "../api/camera.api";
// import { getAlertStats } from "../api/alerts.api";
// import { getCrimeNews } from "../api/news";

// export default function Dashboard() {
//   // const trends = [
//   //   { month: "Jan", crimes: 120 },
//   //   { month: "Feb", crimes: 90 },
//   //   { month: "Mar", crimes: 150 },
//   // ];

//   // const severity = [
//   //   { name: "Critical", value: 15 },
//   //   { name: "High", value: 25 },
//   //   { name: "Medium", value: 35 },
//   //   { name: "Low", value: 20 },
//   // ];

//   const [trends, setTrends] = useState([]);
//   const [severity, setSeverity] = useState([]);
//   const [stats, setStats] = useState({
//     todayCrimes: 0,
//     activeCameras: 0,
//     activeAlerts: 0,
//   });
//   const [hotspots, setHotspots] = useState([]);
//   const [todayCrimeList, setTodayCrimeList] = useState([]);
//   const [crimeNews, setCrimeNews] = useState([]);

//   useEffect(() => {
//     getCrimeStats()
//       .then((res) => {
//         const data = res?.data?.data || {};
//         const bySeverity = data?.bySeverity || {};

//         setStats((prev) => ({
//           ...prev,
//           todayCrimes: data?.todayCrimes || 0,
//         }));

//         setSeverity([
//           { name: "High", value: bySeverity.high || 0 },
//           { name: "Medium", value: bySeverity.medium || 0 },
//           { name: "Low", value: bySeverity.low || 0 },
//         ]);
//       })
//       .catch(() => setSeverity([]));

//     getCrimeTrends({ groupBy: "month" })
//       .then((res) => {
//         const trendRows = res?.data?.data?.trends || [];
//         setTrends(
//           trendRows.map((t) => ({
//             month: t.period || t.month || "N/A",
//             crimes: t.totalCrimes || t.count || 0,
//           }))
//         );
//       })
//       .catch(() => setTrends([]));

//     getCrimeHotspots({ topN: 5 })
//       .then((res) => {
//         setHotspots(res?.data?.data?.hotspots || []);
//       })
//       .catch(() => setHotspots([]));

//     getCameraStats()
//       .then((res) =>
//         setStats((prev) => ({
//           ...prev,
//           activeCameras: res?.data?.data?.active || 0,
//         }))
//       )
//       .catch(() => {});

//     getAlertStats()
//       .then((res) =>
//         setStats((prev) => ({
//           ...prev,
//           activeAlerts: res?.data?.data?.active || 0,
//         }))
//       )
//       .catch(() => {});

//     const today = new Date().toISOString().split("T")[0];
//     getCrimes({ startDate: today, endDate: today, limit: 6, sortBy: "time", order: "desc" })
//       .then((res) => {
//         setTodayCrimeList(res?.data?.data || []);
//       })
//       .catch(() => setTodayCrimeList([]));
//   }, []);
  
//   useEffect(() => {
//     getCrimeNews()
//       .then((res) => {
//         console.log("NEWS API RESPONSE:", res.data);
//         setCrimeNews(res?.data?.articles || []);
//       })
//       .catch((err) => {
//         console.error("NEWS ERROR:", err);
//         setCrimeNews([]);
//       });
//   }, []);

//   return (
//     <DashboardLayout title="Dashboard">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* <StatCard icon={ShieldAlert} label="Crimes Today" value={42} />
//         <StatCard icon={Camera} label="Active Cameras" value={120} />
//         <StatCard icon={Bell} label="Active Alerts" value={8} /> */}
//         <StatCard icon={ShieldAlert} label="Crimes Today" value={stats.todayCrimes} />
//         <StatCard icon={Camera} label="Active Cameras" value={stats.activeCameras} />
//         <StatCard icon={Bell} label="Active Alerts" value={stats.activeAlerts} />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         <CrimeTrendChart data={trends} />
//         <SeverityPieChart data={severity} />
//       </div>

//       <div className="mt-6">
//         <AISummaryBox
//           // title="AI Daily Summary"
//           // content="Crime activity increased by 12% compared to yesterday."
//           title="Today Crime Hotspots"
//           content={
//             hotspots.length
//               ? hotspots
//                   .map((h) => `${h.area} (${h.riskLevel} • ${h.mostCommonCrime})`)
//                   .join(" | ")
//               : "No hotspot predictions available right now."
//           }
//         />
//       </div>

//       <div className="mt-6 bg-[#111118] rounded-xl border border-white/10 p-4">
//         <h3 className="text-white font-semibold mb-3">📰 Crime News Today</h3>

//         {crimeNews.length === 0 ? (
//           <p className="text-sm text-gray-400">No news available.</p>
//         ) : (
//           <div className="space-y-3">
//             {crimeNews.slice(0, 5).map((news, index) => (
//               <a
//                 key={index}
//                 href={news.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block border border-white/10 rounded-lg p-3 bg-black/30 hover:bg-black/50"
//               >
//                 <p className="text-white text-sm font-medium">
//                   {news.title}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {news.source?.name} | {new Date(news.publishedAt).toLocaleTimeString()}
//                 </p>
//               </a>
//             ))}
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

// import DashboardLayout from "../components/layout/DashboardLayout";
// import StatCard from "../components/ui/StatCard";
// import CrimeTrendChart from "../components/charts/CrimeTrendChart";
// import SeverityPieChart from "../components/charts/SeverityPieChart";
// import AISummaryBox from "../components/ui/AISummaryBox";
// import { ShieldAlert, Camera, Bell } from "lucide-react";
// import { useEffect, useState } from "react";

// import { getAnalytics } from "../api/analytics.api";
// import { getCameraStats } from "../api/camera.api";
// import { getAlertStats } from "../api/alerts.api";
// import { getCrimeNews } from "../api/news";



// const formatMonth = (value) => {
//   if (!value) return "N/A";

//   const [year, month] = value.split("-");
//   const months = [
//     "Jan","Feb","Mar","Apr","May","Jun",
//     "Jul","Aug","Sep","Oct","Nov","Dec"
//   ];

//   return months[parseInt(month) - 1] || value;
// };

// const formatTrendData = (trends = []) => {
//   const grouped = {};

//   trends.forEach((item) => {
//     const monthKey = item._id || item.period;
//     const crimeType = item.crimeType || "theft";
//     const count = item.count || item.total || 0;

//     if (!grouped[monthKey]) {
//       grouped[monthKey] = {
//         month: formatMonth(monthKey),
//         theft: 0,
//         robbery: 0,
//         assault: 0,
//         violence: 0,
//       };
//     }

//     grouped[monthKey][crimeType] = count;
//   });

//   return Object.values(grouped);
// };

// export default function Dashboard() {
//   const [trends, setTrends] = useState([]);
//   const [severity, setSeverity] = useState([]);
//   const [stats, setStats] = useState({
//     totalCrimes: 0,
//     activeCameras: 0,
//     activeAlerts: 0,
//   });

//   const [crimeNews, setCrimeNews] = useState([]);
//   const [hotspotText, setHotspotText] = useState("Loading insights...");

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const fetchDashboard = async () => {
//     try {
//       const res = await getAnalytics();
//       const data = res.data.data;

//       // ✅ stats
//       setStats((prev) => ({
//         ...prev,
//         totalCrimes: data?.stats?.totalCrimes || 0,
//       }));

//       // ✅ FIXED TREND (multi-type)
//       const formatted = formatTrendData(data?.trends || []);
//       setTrends(formatted);

//       // ✅ severity
//       const risk = data?.riskDistribution || {};
//       setSeverity([
//         { name: "High", value: risk.high || 0 },
//         { name: "Medium", value: risk.medium || 0 },
//         { name: "Low", value: risk.low || 0 },
//       ]);

//       // ✅ hotspot text
//       if (data?.topCrimes?.length) {
//         setHotspotText(
//           data.topCrimes.map((c) => `${c._id} (${c.count})`).join(" | ")
//         );
//       }

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     getCameraStats().then((res) => {
//       setStats((prev) => ({
//         ...prev,
//         activeCameras: res?.data?.data?.active || 0,
//       }));
//     });

//     getAlertStats().then((res) => {
//       setStats((prev) => ({
//         ...prev,
//         activeAlerts: res?.data?.data?.active || 0,
//       }));
//     });
//   }, []);

//   useEffect(() => {
//     getCrimeNews()
//       .then((res) => setCrimeNews(res?.data?.articles || []))
//       .catch(() => setCrimeNews([]));
//   }, []);

//   return (
//     <DashboardLayout title="Dashboard">

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatCard icon={ShieldAlert} label="Total Crimes" value={stats.totalCrimes} />
//         <StatCard icon={Camera} label="Active Cameras" value={stats.activeCameras} />
//         <StatCard icon={Bell} label="Active Alerts" value={stats.activeAlerts} />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         <CrimeTrendChart data={trends} />
//         <SeverityPieChart data={severity} />
//       </div>

//       <div className="mt-6">
//         <AISummaryBox title="Top Crime Insights" content={hotspotText} />
//       </div>

//       <div className="mt-6 bg-[#111118] rounded-xl border border-white/10 p-4">
//         <h3 className="text-white font-semibold mb-3">📰 Crime News</h3>

//         {crimeNews.slice(0, 5).map((news, index) => (
//           <a key={index} href={news.url} target="_blank" className="block p-3 mb-2 bg-black/30 rounded">
//             <p className="text-white text-sm">{news.title}</p>
//           </a>
//         ))}
//       </div>
//     </DashboardLayout>
//   );
// }


import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import CrimeTrendChart from "../components/charts/CrimeTrendChart";
import SeverityPieChart from "../components/charts/SeverityPieChart";
import AISummaryBox from "../components/ui/AISummaryBox";
import { ShieldAlert, Camera, Bell, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMap from "../components/map/DashboardMap";

import { getAnalytics } from "../api/analytics.api";
import { getCameraStats } from "../api/camera.api";
import { getAlertStats, getAlerts } from "../api/alerts.api";
import { getCrimeNews } from "../api/news";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// 🔥 HELPERS
const formatMonth = (value) => {
  if (!value) return "N/A";
  const [_, m] = value.split("-");
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m)-1];
};

const formatTrendData = (trends = []) => {
  const grouped = {};

  trends.forEach((item) => {
    const key = item._id;
    const type = item.crimeType;
    const count = item.count;

    if (!grouped[key]) {
      grouped[key] = {
        month: formatMonth(key),
        theft: 0,
        robbery: 0,
        assault: 0,
        violence: 0,
      };
    }

    grouped[key][type] = count;
  });

  return Object.values(grouped);
};

export default function Dashboard() {
  const [trends, setTrends] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalCrimes: 0,
    activeCameras: 0,
    activeAlerts: 0,
  });

  const [crimeNews, setCrimeNews] = useState([]);
  const [aiSummary, setAiSummary] = useState("Analyzing crime patterns...");

  // 🔥 FETCH ANALYTICS
  const fetchDashboard = async () => {
    try {
      const res = await getAnalytics();
      const data = res.data.data;

      setStats((prev) => ({
        ...prev,
        totalCrimes: data?.stats?.totalCrimes || 0,
      }));

      setTrends(formatTrendData(data?.trends || []));

      const risk = data?.riskDistribution || {};
      setSeverity([
        { name: "High", value: risk.high || 0 },
        { name: "Medium", value: risk.medium || 0 },
        { name: "Low", value: risk.low || 0 },
      ]);

      // 🔥 AI SUMMARY (derived)
      if (data?.topCrimes?.length) {
        const top = data.topCrimes[0];
        setAiSummary(
          `Most frequent crime is ${top._id} (${top.count} cases). Increased monitoring recommended.`
        );
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();

    getCameraStats().then((res) =>
      setStats((prev) => ({
        ...prev,
        activeCameras: res?.data?.data?.active || 0,
      }))
    );

    getAlertStats().then((res) =>
      setStats((prev) => ({
        ...prev,
        activeAlerts: res?.data?.data?.active || 0,
      }))
    );

    getAlerts().then((res) => {
      setAlerts(res?.data?.data || []);
    });

    getCrimeNews().then((res) =>
      setCrimeNews(res?.data?.articles || [])
    );
  }, []);

  // 🔥 REAL-TIME ALERTS
  useEffect(() => {
    socket.on("new-alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    return () => socket.off("new-alert");
  }, []);

  return (
    <DashboardLayout title="Dashboard">

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ShieldAlert} label="Crimes" value={stats.totalCrimes} />
        <StatCard icon={Camera} label="Cameras" value={stats.activeCameras} />
        <StatCard icon={Bell} label="Alerts" value={stats.activeAlerts} />
        <StatCard icon={Activity} label="Live Feed" value={alerts.length > 0 ? "Active" : "Idle"} />
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">

        {/* 📊 LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <CrimeTrendChart data={trends} />
          <SeverityPieChart data={severity} />
        </div>

        {/* 🤖 RIGHT PANEL */}
        <div className="space-y-6">

          <AISummaryBox title="AI Insight" content={aiSummary} />

          {/* 🚨 ALERT PANEL */}
          <div className="bg-[#111118] p-4 rounded-xl border border-white/10">
            <h3 className="text-white mb-3 font-semibold">Live Alerts</h3>

            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {alerts.slice(0, 5).map((a) => (
                <div
                  key={a.alertId}
                  className="text-xs p-2 rounded bg-black/30 border border-white/10"
                >
                  <p className="text-red-400">{a.crimeType}</p>
                  <p className="text-gray-400">{a.location}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 📰 NEWS */}
      <div className="mt-6 bg-[#111118] p-4 rounded-xl border border-white/10">
        <h3 className="text-white mb-3 font-semibold">Crime News</h3>

        <div className="grid md:grid-cols-2 gap-3">
          {crimeNews.slice(0, 4).map((news, i) => (
            <a key={i} href={news.url} target="_blank"
              className="p-3 bg-black/30 rounded border border-white/10">
              <p className="text-white text-sm">{news.title}</p>
            </a>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}