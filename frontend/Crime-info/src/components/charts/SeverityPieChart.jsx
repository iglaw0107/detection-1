import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];

export default function SeverityPieChart({ data }) {
  return (
    <div className="bg-[#111118] p-5 rounded-xl border border-white/5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Severity Distribution
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-3 mt-3 flex-wrap">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span className="text-xs text-gray-400">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}