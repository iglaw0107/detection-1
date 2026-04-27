// import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

// export default function DashboardMap({ hotspots = [], activeCrime }) {

//   const filtered = activeCrime
//     ? hotspots.filter((h) => h.crimeType === activeCrime)
//     : hotspots;

//   const getColor = (count) => {
//     if (count > 80) return "#ef4444";
//     if (count > 30) return "#f59e0b";
//     return "#22c55e";
//   };

//   return (
//     <MapContainer center={[28.6139, 77.2090]} zoom={11} style={{ height: 400 }}>
//       <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

//       {filtered.map((a, i) => (
//         <CircleMarker
//           key={i}
//           center={[a.lat, a.lng]}
//           radius={Math.max(10, a.count / 2)}
//           pathOptions={{
//             fillColor: getColor(a.count),
//             color: getColor(a.count),
//             fillOpacity: 0.5,
//           }}
//         >
//           <Popup>
//             {a.location} <br />
//             Crimes: {a.count}
//           </Popup>
//         </CircleMarker>
//       ))}
//     </MapContainer>
//   );
// }
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

function HeatLayer({ hotspots }) {
  const map = useMap();

  useEffect(() => {
    if (!hotspots || hotspots.length === 0) return;

    // 🔥 CONVERT TO HEAT DATA
    const heatData = hotspots.map((h, i) => {
      const lat =
        h.lat || 28.5 + Math.random() * 0.3 + i * 0.001;
      const lng =
        h.lng || 77.0 + Math.random() * 0.3 + i * 0.001;

      const intensity = Math.min(1, (h.count || 1) / 100);

      return [lat, lng, intensity];
    });

    // 🔥 CREATE HEATMAP
    const heatLayer = L.heatLayer(heatData, {
      radius: 40,
      blur: 25,
      maxZoom: 17,
      gradient: {
        0.2: "#22c55e", // green
        0.4: "#f59e0b", // yellow
        0.7: "#ef4444", // red
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [hotspots, map]);

  return null;
}

export default function DashboardMap({ hotspots = [] }) {
  const center = [28.6139, 77.2090];

  return (
    <div className="bg-[#111118] p-4 rounded-xl border border-white/10">

      <h3 className="text-white mb-3 font-semibold">
        🔥 Crime Density Heatmap
      </h3>

      {hotspots.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No hotspot data available
        </p>
      ) : (
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: "450px", width: "100%", borderRadius: "12px" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {/* 🔥 HEAT LAYER */}
          <HeatLayer hotspots={hotspots} />
        </MapContainer>
      )}

      {/* LEGEND */}
      <div className="flex gap-4 mt-4 text-xs text-gray-400">
        <span className="text-green-400">Low</span>
        <span className="text-yellow-400">Medium</span>
        <span className="text-red-400">High</span>
      </div>

    </div>
  );
}