// import { useEffect, useState } from "react";
// import DashboardLayout from "../components/layout/DashboardLayout";
// import { getCrimes, predictCrime } from "../api/crime.api";
// import { getCrimeNews } from "../api/news";
// import Badge from "../components/ui/Badge";
// import DashboardMap from "../components/map/DashboardMap";

// export default function Crimes() {
//   const [crimes, setCrimes] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [hotspots, setHotspots] = useState([]);
//   const [aiRisk, setAiRisk] = useState(null);
//   const [crimeNews, setCrimeNews] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 📍 TEMP COORD MAP (upgrade later)
//   const coordsMap = {
//     Delhi: { lat: 28.6139, lng: 77.2090 },
//     Mumbai: { lat: 19.0760, lng: 72.8777 },
//     Bangalore: { lat: 12.9716, lng: 77.5946 },
//   };

//   // 🔥 FETCH CRIMES + AI
//   useEffect(() => {
//     if (!selectedLocation) return;

//     fetchAllData(selectedLocation);
//   }, [selectedLocation]);

//   const fetchAllData = async (location) => {
//     setLoading(true);

//     try {
//       // 1️⃣ GET HISTORY
//       const crimeRes = await getCrimes({ location });
//       const crimeData = crimeRes?.data?.data || [];
//       setCrimes(crimeData);

//       // 2️⃣ GET AI PREDICTION
//       const aiRes = await predictCrime({
//         location,
//         time: new Date().toTimeString().slice(0, 5),
//       });

//       const aiData = aiRes?.data?.data;
//       setAiRisk(aiData);

//       // 3️⃣ BUILD HOTSPOTS
//       const grouped = {};

//       crimeData.forEach((c) => {
//         const loc = c.location || location;

//         if (!grouped[loc]) {
//           grouped[loc] = {
//             name: loc,
//             count: 0,
//           };
//         }

//         grouped[loc].count += 1;
//       });

//       const formatted = Object.values(grouped).map((item) => {
//         let risk = "low";

//         // 📊 HISTORICAL
//         if (item.count > 20) risk = "medium";
//         if (item.count > 50) risk = "high";

//         // 🤖 AI OVERRIDE
//         if (aiData?.risk_level === "HIGH") risk = "high";
//         else if (
//           aiData?.risk_level === "MEDIUM" &&
//           risk !== "high"
//         )
//           risk = "medium";

//         return {
//           ...item,
//           risk,
//           lat: coordsMap[item.name]?.lat || 28.6139,
//           lng: coordsMap[item.name]?.lng || 77.2090,
//         };
//       });

//       setHotspots(formatted);

//     } catch (err) {
//       console.error("Fetch error:", err);
//       setCrimes([]);
//       setHotspots([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📰 NEWS
//   useEffect(() => {
//     if (!selectedLocation) return;

//     getCrimeNews(selectedLocation)
//       .then((res) => {
//         setCrimeNews(res?.data?.articles || []);
//       })
//       .catch(() => setCrimeNews([]));
//   }, [selectedLocation]);

//   return (
//     <DashboardLayout title="Crimes Intelligence">

//       {/* 🔍 SEARCH */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search city (Delhi...)"
//           value={selectedLocation}
//           onChange={(e) => setSelectedLocation(e.target.value)}
//           className="bg-[#111118] text-white p-2 rounded border border-white/10 w-full max-w-md"
//         />
//       </div>

//       {/* 🤖 AI RESULT */}
//       {aiRisk && (
//         <div className="mb-6 bg-[#111118] p-4 rounded-xl border border-white/10">
//           <h3 className="text-white font-semibold mb-2">
//             🤖 AI Risk Analysis
//           </h3>

//           <p className="text-sm text-gray-300">
//             Risk Level:{" "}
//             <span
//               className={`font-semibold ${
//                 aiRisk.risk_level === "HIGH"
//                   ? "text-red-400"
//                   : aiRisk.risk_level === "MEDIUM"
//                   ? "text-yellow-400"
//                   : "text-green-400"
//               }`}
//             >
//               {aiRisk.risk_level}
//             </span>
//           </p>

//           <p className="text-xs text-gray-400 mt-2">
//             {aiRisk.aiSummary}
//           </p>
//         </div>
//       )}

//       {/* 🗺️ MAP */}
//       <div className="mb-8">
//         <DashboardMap areas={hotspots} />
//       </div>

//       {/* 📋 TABLE */}
//       <div className="bg-[#111118] rounded-xl border border-white/10 p-4">
//         <h3 className="text-white mb-3">📋 Crime Records</h3>

//         {loading ? (
//           <p className="text-gray-400 text-sm">Loading...</p>
//         ) : crimes.length === 0 ? (
//           <p className="text-gray-400 text-sm">
//             No data available
//           </p>
//         ) : (
//           <table className="w-full text-sm text-gray-300">
//             <thead>
//               <tr className="text-gray-500">
//                 <th>Type</th>
//                 <th>Severity</th>
//                 <th>Location</th>
//               </tr>
//             </thead>

//             <tbody>
//               {crimes.map((c) => (
//                 <tr key={c._id} className="border-t border-white/10">
//                   <td className="capitalize">{c.crimeType}</td>

//                   <td>
//                     <Badge
//                       variant={
//                         c.severity === "high"
//                           ? "danger"
//                           : c.severity === "medium"
//                           ? "warning"
//                           : "success"
//                       }
//                     >
//                       {c.severity}
//                     </Badge>
//                   </td>

//                   <td className="text-gray-400">
//                     {c.location}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* 📰 NEWS */}
//       {crimeNews.length > 0 && (
//         <div className="mt-8 bg-[#111118] p-4 rounded-xl border border-white/10">
//           <h3 className="text-white mb-3">
//             📰 Crime News ({selectedLocation})
//           </h3>

//           {crimeNews.slice(0, 5).map((n, i) => (
//             <a
//               key={i}
//               href={n.url}
//               target="_blank"
//               rel="noreferrer"
//               className="block p-3 mb-2 bg-black/30 rounded hover:bg-black/50"
//             >
//               <p className="text-white text-sm">{n.title}</p>
//               <p className="text-xs text-gray-400">
//                 {n.source?.name}
//               </p>
//             </a>
//           ))}
//         </div>
//       )}

//     </DashboardLayout>
//   );
// }



import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCrimes, predictCrime } from "../api/crime.api";
import { getCrimeNews } from "../api/news";
import Badge from "../components/ui/Badge";
import DashboardMap from "../components/map/DashboardMap";

export default function Crimes() {
  const [crimes, setCrimes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hotspots, setHotspots] = useState([]);
  const [aiRisk, setAiRisk] = useState(null);
  const [crimeNews, setCrimeNews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // 🔥 LOAD CRIMES + MAP ONLY (AUTO)
  useEffect(() => {
    if (!selectedLocation) return;
    fetchAllData(selectedLocation);
  }, [selectedLocation]);

  const fetchAllData = async (location) => {
    setLoading(true);

    try {
      const res = await getCrimes({ location });
      const data = res?.data?.data || [];
      setCrimes(data);

      // 🔥 HOTSPOTS BUILD
      const grouped = {};

      data.forEach((c, i) => {
        const key = `${c.location}_${c.predictedCrime || c.crimeType || "unknown"}`;

        if (!grouped[key]) {
          grouped[key] = {
            name: c.location,
            crimeType: c.predictedCrime || c.crimeType || "unknown",
            count: 0,
            lat: c.lat || (28.5 + Math.random() * 0.3 + i * 0.001),
            lng: c.lng || (77.0 + Math.random() * 0.3 + i * 0.001),
          };
        }

        grouped[key].count += 1;
      });

      const formatted = Object.values(grouped).map((item) => {
        let risk = "low";
        if (item.count > 50) risk = "high";
        else if (item.count > 20) risk = "medium";

        return { ...item, risk };
      });

      setHotspots(formatted);

    } catch (err) {
      console.error(err);
      setCrimes([]);
      setHotspots([]);
    } finally {
      setLoading(false);
    }
  };

  // 🤖 AI + NEWS ONLY ON BUTTON CLICK
  const fetchAI = async () => {
    if (!selectedLocation.trim()) return;

    setAiLoading(true);

    try {
      // AI
      const aiRes = await predictCrime({
        location: selectedLocation,
        time: new Date().toTimeString().slice(0, 5),
      });

      setAiRisk(aiRes?.data?.data);

      // NEWS
      const newsRes = await getCrimeNews(selectedLocation);
      setCrimeNews(newsRes?.data?.articles || []);

    } catch (err) {
      console.error("AI / News error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <DashboardLayout title="Crime Intelligence">

      {/* 🔍 SEARCH */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search city (Delhi...)"
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setAiRisk(null);      // reset AI
            setCrimeNews([]);     // reset news
          }}
          className="bg-[#111118] text-white p-2 rounded border border-white/10 w-full max-w-md"
        />

        <button
          onClick={fetchAI}
          disabled={!selectedLocation || aiLoading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm disabled:opacity-50"
        >
          {aiLoading ? "Analyzing..." : "Analyze AI"}
        </button>
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* 🤖 AI PANEL */}
          {aiRisk && (
            <div className="p-5 bg-[#111118] border border-white/10 rounded-xl">
              <h3 className="text-white mb-2">🧠 AI Risk Analysis</h3>

              <p
                className={`text-xl font-bold ${
                  aiRisk.risk_level === "HIGH"
                    ? "text-red-500"
                    : aiRisk.risk_level === "MEDIUM"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {aiRisk.risk_level}
              </p>

              <p className="text-gray-400 text-sm mt-2">
                {aiRisk.aiSummary}
              </p>
            </div>
          )}

          {/* 🗺️ MAP */}
          <DashboardMap hotspots={hotspots} />

          {/* 📋 TABLE */}
          <div className="bg-[#111118] rounded-xl border border-white/10 p-4">
            <h3 className="text-white mb-3">📋 Crime Records</h3>

            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : crimes.length === 0 ? (
              <p className="text-gray-400 text-sm">No data available</p>
            ) : (
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="text-gray-500">
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Location</th>
                  </tr>
                </thead>

                <tbody>
                  {crimes.map((c) => (
                    <tr key={c._id} className="border-t border-white/10">
                      <td>{c.predictedCrime || c.crimeType}</td>

                      <td>
                        <Badge variant={c.riskLevel || "low"}>
                          {c.riskLevel || "low"}
                        </Badge>
                      </td>

                      <td className="text-gray-400">{c.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR → NEWS */}
        <div className="bg-[#111118] border border-white/10 rounded-xl p-4 h-fit sticky top-4">

          <h3 className="text-white mb-4">📰 Crime News</h3>

          {crimeNews.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Click "Analyze AI" to load news
            </p>
          ) : (
            <div className="space-y-3">
              {crimeNews.slice(0, 8).map((n, i) => (
                <a
                  key={i}
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 bg-black/30 rounded hover:bg-black/50 transition"
                >
                  <p className="text-white text-sm font-medium">
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.source?.name}
                  </p>
                </a>
              ))}
            </div>
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}