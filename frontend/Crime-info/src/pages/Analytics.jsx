import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CrimeTrendChart from "../components/charts/CrimeTrendChart";
import SeverityPieChart from "../components/charts/SeverityPieChart";
import DashboardMap from "../components/map/DashboardMap";
import { getAnalytics } from "../api/analytics.api";
import { socket } from "../socket/socket";

const CRIME_TYPES = ["theft", "robbery", "assault", "violence"];

export default function Analytics() {
  const [trendData, setTrendData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [topCrimes, setTopCrimes] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  const [selectedTypes, setSelectedTypes] = useState(CRIME_TYPES);
  const [location, setLocation] = useState("Delhi");
  const [activeCrime, setActiveCrime] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, [location, selectedTypes]);

  useEffect(() => {
    socket.on("new-alert", fetchAnalytics);
    return () => socket.off("new-alert");
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalytics({ location });
      const data = res.data.data;

      setTrendData(formatTrendData(data?.trends || [], selectedTypes));

      const risk = data?.riskDistribution || {};
      setSeverityData([
        { name: "High", value: risk.high || 0 },
        { name: "Medium", value: risk.medium || 0 },
        { name: "Low", value: risk.low || 0 },
      ]);

      setTopCrimes(data?.topCrimes || []);
      setHotspots(data?.hotspots || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  return (
    <DashboardLayout title="Analytics">

      {/* LOCATION */}
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="bg-[#111118] p-2 rounded text-white border mb-4"
      />

      {/* TYPE FILTER */}
      <div className="flex gap-2 mb-4">
        {CRIME_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`px-3 py-1 rounded ${
              selectedTypes.includes(type)
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* TOP CRIMES */}
      <div className="bg-[#111118] p-4 rounded mb-6">
        <h3 className="text-white mb-2">🔥 Top Crimes</h3>
        {topCrimes.map((c, i) => (
          <div key={i} className="flex justify-between text-sm mb-1">
            <span>{c._id}</span>
            <span className="text-purple-400">{c.count}</span>
          </div>
        ))}
      </div>

      {/* CHART */}
      <CrimeTrendChart
        data={trendData}
        activeCrime={activeCrime}
        onCrimeClick={(type) =>
          setActiveCrime((prev) => (prev === type ? null : type))
        }
      />

      {/* ACTIVE LABEL */}
      {activeCrime && (
        <p className="text-purple-400 mt-2">
          Showing: {activeCrime}
        </p>
      )}

      {/* MAP */}
      <div className="mt-6">
        <DashboardMap hotspots={hotspots} activeCrime={activeCrime} />
      </div>

      {/* PIE */}
      <div className="mt-6">
        <SeverityPieChart data={severityData} />
      </div>

    </DashboardLayout>
  );
}

// helpers
const formatMonth = (value) => {
  const [year, month] = value.split("-");
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month-1];
};

const formatTrendData = (trends = [], selectedTypes) => {
  const grouped = {};

  trends.forEach((item) => {
    const m = item._id;
    const t = item.crimeType;
    const c = item.count;

    if (!grouped[m]) {
      grouped[m] = { month: formatMonth(m) };
      selectedTypes.forEach((x) => (grouped[m][x] = 0));
    }

    if (selectedTypes.includes(t)) {
      grouped[m][t] += c;
    }
  });

  return Object.values(grouped);
};