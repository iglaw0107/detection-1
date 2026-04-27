// import {
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function CrimeTrendChart({ data }) {
//   return (
//     <div className="bg-[#111118] p-5 rounded-xl border border-white/5">
//       <h3 className="text-sm font-semibold text-gray-300 mb-4">
//         Crime Trend Overview
//       </h3>

//       <ResponsiveContainer width="100%" height={260}>
//         <AreaChart data={data}>
//           <defs>
//             <linearGradient id="crimeGrad" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
//               <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

//           <XAxis
//             dataKey="month"
//             tick={{ fill: "#6B7280", fontSize: 11 }}
//             axisLine={false}
//             tickLine={false}
//           />

//           <YAxis
//             tick={{ fill: "#6B7280", fontSize: 11 }}
//             axisLine={false}
//             tickLine={false}
//           />

//           <Tooltip
//             contentStyle={{
//               background: "#111118",
//               border: "1px solid rgba(255,255,255,0.1)",
//               borderRadius: 8,
//               color: "#fff",
//             }}
//           />

//           <Area
//             type="monotone"
//             dataKey="crimes"
//             stroke="#8B5CF6"
//             strokeWidth={2}
//             fill="url(#crimeGrad)"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import {
  AreaChart, Area, CartesianGrid,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function CrimeTrendChart({ data, onCrimeClick, activeCrime }) {

  const COLORS = {
    theft: "#8B5CF6",
    robbery: "#EF4444",
    assault: "#F59E0B",
    violence: "#3B82F6",
  };

  return (
    <div className="bg-[#111118] p-5 rounded-xl">
      <h3 className="text-gray-300 mb-3">Crime Trends</h3>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {Object.keys(COLORS).map((type) => (
            <Area
              key={type}
              type="monotone"
              dataKey={type}
              stroke={COLORS[type]}
              strokeWidth={activeCrime === type ? 4 : 2}
              opacity={activeCrime && activeCrime !== type ? 0.2 : 1}
              fillOpacity={0.1}
              onClick={() => onCrimeClick(type)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}