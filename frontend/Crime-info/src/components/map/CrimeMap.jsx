// import { useEffect, useRef } from "react";
// import maplibregl from "maplibre-gl";
// import geoData from "../../public/data/countries.geo.json";

// export default function CrimeMap({ hotspots }) {
//   const mapContainer = useRef(null);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (mapRef.current) return;

//     mapRef.current = new maplibregl.Map({
//       container: mapContainer.current,
//       style: "https://demotiles.maplibre.org/style.json",
//       center: [77.2090, 28.6139],
//       zoom: 4,
//     });

//     mapRef.current.on("load", () => {
//       mapRef.current.addSource("zones", {
//         type: "geojson",
//         data: geoData,
//       });

//       mapRef.current.addLayer({
//         id: "zone-fill",
//         type: "fill",
//         source: "zones",
//         paint: {
//           "fill-color": [
//             "case",
//             ["==", ["get", "risk"], "high"],
//             "#ef4444",
//             ["==", ["get", "risk"], "medium"],
//             "#f59e0b",
//             "#22c55e",
//           ],
//           "fill-opacity": 0.5,
//         },
//       });

//       mapRef.current.addLayer({
//         id: "zone-border",
//         type: "line",
//         source: "zones",
//         paint: {
//           "line-color": "#ffffff",
//           "line-width": 1,
//         },
//       });
//     });
//   }, []);

//   // 🔥 UPDATE DATA WITH HOTSPOTS
//   useEffect(() => {
//     if (!mapRef.current) return;

//     const updatedGeo = {
//       ...geoData,
//       features: geoData.features.map((f) => {
//         const name = f.properties.name;

//         const hotspot = hotspots.find((h) =>
//           name.toLowerCase().includes(h._id.toLowerCase())
//         );

//         let risk = "low";

//         if (hotspot?.count > 80) risk = "high";
//         else if (hotspot?.count > 30) risk = "medium";

//         return {
//           ...f,
//           properties: {
//             ...f.properties,
//             risk,
//           },
//         };
//       }),
//     };

//     const source = mapRef.current.getSource("zones");
//     if (source) {
//       source.setData(updatedGeo);
//     }
//   }, [hotspots]);

//   return (
//     <div className="bg-[#111118] p-4 rounded-xl border border-white/10">
//       <h3 className="text-white mb-3">🔥 Risk Zones</h3>
//       <div
//         ref={mapContainer}
//         style={{ height: "450px", width: "100%" }}
//         className="rounded-xl overflow-hidden"
//       />
//     </div>
//   );
// }