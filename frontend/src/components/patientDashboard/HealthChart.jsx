import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function HealthChart({ vitals = [] }) {
  const chartData = vitals
  .slice()
  .reverse()
  .map((vital) => ({
    date: new Date(vital.createdAt).toLocaleDateString(),

    heartRate: vital.heartRate,

    sugarLevel: vital.sugarLevel,

    bloodPressure:
      Math.round(
        (vital.bpSystolic + vital.bpDiastolic) / 2
      ),
  }));
  return (
    <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Health Trends
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Heart rate, sugar level, and blood pressure trend
          </p>
        </div>

        <span className="w-fit rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          This week
        </span>
      </div>

      <div className="h-80 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={chartData} margin={{ left: -20, right: 10, top: 10 }}>
            <CartesianGrid
              stroke="#e8eefc"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "0",
                borderRadius: "14px",
                boxShadow: "0 12px 30px rgba(37,99,235,.12)",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Line
              dataKey="heartRate"
              dot={false}
              name="Heart Rate"
              stroke="#2563eb"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              dataKey="sugarLevel"
              dot={false}
              name="Sugar Level"
              stroke="#06b6d4"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              dataKey="bloodPressure"
              dot={false}
              name="Blood Pressure"
              stroke="#f59e0b"
              strokeWidth={3}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default HealthChart;
