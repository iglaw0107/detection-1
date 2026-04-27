// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];

// export default function SeverityPieChart({ data }) {
//   return (
//     <div className="bg-[#111118] p-5 rounded-xl border border-white/5">
//       <h3 className="text-sm font-semibold text-gray-300 mb-4">
//         Severity Distribution
//       </h3>

//       <ResponsiveContainer width="100%" height={260}>
//         <PieChart>
//           <Pie
//             data={data}
//             innerRadius={60}
//             outerRadius={85}
//             paddingAngle={4}
//             dataKey="value"
//           >
//             {data.map((_, index) => (
//               <Cell key={index} fill={COLORS[index]} />
//             ))}
//           </Pie>

//           <Tooltip
//             contentStyle={{
//               background: "#111118",
//               border: "1px solid rgba(255,255,255,0.1)",
//               borderRadius: 8,
//               color: "#fff",
//             }}
//           />
//         </PieChart>
//       </ResponsiveContainer>

//       <div className="flex justify-center gap-3 mt-3 flex-wrap">
//         {data.map((item, i) => (
//           <div key={item.name} className="flex items-center gap-1.5">
//             <span
//               className="w-2 h-2 rounded-full"
//               style={{ backgroundColor: COLORS[i] }}
//             />
//             <span className="text-xs text-gray-400">{item.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#EF4444", "#F59E0B", "#3B82F6"];

// 🔥 DEFAULT DATA (when backend empty)
const DEFAULT_DATA = [
  { name: "High", value: 12 },
  { name: "Medium", value: 25 },
  { name: "Low", value: 18 },
];

export default function SeverityPieChart({ data }) {
  const chartData =
    data && data.length && data.some((d) => d.value > 0)
      ? data
      : DEFAULT_DATA;

  const total = chartData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="bg-[#111118] p-5 rounded-2xl border border-white/10 shadow-lg">
      
      {/* TITLE */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          Severity Distribution
        </h3>
        <span className="text-xs text-gray-500">
          Total: {total}
        </span>
      </div>

      {/* CHART */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              animationDuration={800}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}`, "Cases"]}
              contentStyle={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 🔥 CENTER TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-white text-lg font-semibold">{total}</p>
          </div>
        </div>
      </div>

      {/* 🔥 LEGEND */}
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        {chartData.map((item, i) => (
          <div
            key={item.name}
            className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-lg border border-white/5"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-gray-300">
              {item.name}
            </span>
            <span className="text-xs text-gray-500">
              ({item.value})
            </span>
          </div>
        ))}
      </div>

      {/* 🔥 EMPTY STATE */}
      {!data?.length && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Showing sample data
        </p>
      )}
    </div>
  );
}