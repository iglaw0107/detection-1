import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCrimes, getCrimeHotspots, getCrimeAreaRisk } from "../api/crimes";
import { getCrimeNews } from "../api/news";
import Badge from "../components/ui/Badge";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Crimes() {
  const [crimes, setCrimes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hotspots, setHotspots] = useState([]);
  const [nearbyHotspots, setNearbyHotspots] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [crimeNews, setCrimeNews] = useState([]);
  const [todayOnly, setTodayOnly] = useState(true);

  // 📋 Fetch Crimes
  useEffect(() => {
    const params = {};
    const today = new Date().toISOString().split("T")[0];

    if (todayOnly) {
      params.startDate = today;
      params.endDate = today;
    }

    if (!selectedLocation) {
      params.limit = 10;
    } else {
      params.location = selectedLocation;
    }

    getCrimes(params)
      .then((res) => {
        setCrimes(res?.data?.data || []);
      })
      .catch(() => setCrimes([]));
  }, [selectedLocation, todayOnly]);

  // 🔥 Hotspots
  useEffect(() => {
    if (!selectedLocation) {
      setHotspots([]);
      setNearbyHotspots([]);
      return;
    }

    getCrimeHotspots({ city: selectedLocation })
      .then((res) => {
        const hotspotData = res?.data?.data?.hotspots || [];

        const normalized = selectedLocation.trim().toLowerCase();

        const exact = hotspotData.filter(
          (h) => (h.area || "").toLowerCase() === normalized
        );

        const nearby = hotspotData.filter(
          (h) => (h.area || "").toLowerCase() !== normalized
        );

        setHotspots(exact);
        setNearbyHotspots(nearby);
      })
      .catch(() => {
        setHotspots([]);
        setNearbyHotspots([]);
      });
  }, [selectedLocation]);

  // ⚠ Area Risk
  useEffect(() => {
    if (!selectedLocation) {
      setRiskData(null);
      setTrendData([]);
      return;
    }

    getCrimeAreaRisk({ city: selectedLocation })
      .then((res) => {
        const data = res?.data?.data || null;
        setRiskData(data);
        setTrendData(data?.monthlyTrend || []);
      })
      .catch(() => {
        setRiskData(null);
        setTrendData([]);
      });
  }, [selectedLocation]);

  // 📰 Crime News
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getCrimeNews(selectedLocation);

        const articles = res?.data?.articles || [];

        if (!articles.length) {
          setCrimeNews([
            {
              title: "No live crime news found. Showing system insight.",
              source: { name: "System" },
              publishedAt: new Date().toISOString(),
              url: "#",
            },
          ]);
        } else {
          setCrimeNews(articles);
        }
      } catch {
        setCrimeNews([]);
      }
    };

    fetchNews();
  }, [selectedLocation]);

  return (
    <DashboardLayout title="Crimes">

      {/* 📍 Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by location (Delhi, Mall...)"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="bg-[#111118] text-white p-2 rounded border border-white/10 w-full max-w-md"
        />

        <label className="mt-3 flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={todayOnly}
            onChange={(e) => setTodayOnly(e.target.checked)}
          />
          Show only today crimes
        </label>
      </div>

      {/* 📋 Crimes Table */}
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="text-gray-500">
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Severity</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Camera</th>
          </tr>
        </thead>

        <tbody>
          {crimes.map((c) => (
            <tr key={c._id} className="border-t border-white/10">
              <td className="p-2">{c.crimeType}</td>
              <td className="p-2">
                <Badge variant="danger">{c.severity}</Badge>
              </td>
              <td className="p-2">{c.isSaved ? "Saved" : "New"}</td>
              <td className="p-2 text-gray-400">{c.location}</td>
              <td className="p-2 text-gray-400">{c.cameraId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 Hotspots */}
      {selectedLocation && (
        <div className="mt-8">
          <h3 className="text-white font-semibold mb-3">
            AI Hotspots (Exact)
          </h3>

          {hotspots.length === 0 ? (
            <p className="text-gray-400 text-sm">No exact hotspot data</p>
          ) : (
            hotspots.map((h, i) => (
              <div key={i} className="p-3 bg-[#1a1a24] rounded mb-2">
                <p className="text-white">{h.area}</p>
                <p className="text-gray-400 text-sm">
                  Crime: {h.mostCommonCrime}
                </p>
                <p className="text-gray-400 text-sm">
                  Risk: {h.riskLevel}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 📍 Nearby */}
      {nearbyHotspots.length > 0 && (
        <div className="mt-8">
          <h3 className="text-white font-semibold mb-3">
            Nearby Locations
          </h3>

          {nearbyHotspots.slice(0, 5).map((h, i) => (
            <div key={i} className="p-3 bg-[#111118] rounded mb-2">
              <p className="text-white">{h.area}</p>
              <p className="text-gray-400 text-sm">
                {h.mostCommonCrime} • {h.riskLevel}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ⚠ Risk */}
      {riskData && (
        <div className="mt-8">
          <h3 className="text-white font-semibold mb-3">
            ⚠ Area Risk
          </h3>

          <div className="bg-[#1a1a24] p-4 rounded">
            <p className="text-white">
              Risk: {riskData.riskLevel}
            </p>

            <div className="bg-gray-700 h-4 rounded mt-2">
              <div
                className="bg-red-500 h-4 rounded"
                style={{ width: `${riskData.riskScore * 10}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 📊 Trend */}
      {trendData.length > 0 && (
        <div className="mt-10">
          <h3 className="text-white mb-4">📊 Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="totalCrimes" stroke="#a855f7" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 📰 NEWS */}
      {selectedLocation && (
        <div className="mt-10">
          <h3 className="text-white font-semibold mb-4">
            📰 Crime News ({selectedLocation})
          </h3>

          {crimeNews.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No news available
            </p>
          ) : (
            crimeNews.slice(0, 5).map((n, i) => (
              <a
                key={i}
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="block p-3 mb-2 bg-[#111118] rounded hover:bg-[#1a1a24]"
              >
                <p className="text-white text-sm">{n.title}</p>
                <p className="text-gray-400 text-xs">
                  {n.source?.name}
                </p>
              </a>
            ))
          )}
        </div>
      )}

    </DashboardLayout>
  );
}