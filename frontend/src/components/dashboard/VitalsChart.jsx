import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function VitalsChart({vitals}) {
  const chartData = vitals.map((vital) => ({
  name: vital.patient.user.name,

  heartRate: vital.heartRate,

  sugarLevel: vital.sugarLevel,

  bloodPressure: vital.bloodPressure,
}));
  const alertsData = [
  {
    name: "HIGH Alerts",
    value: vitals.filter(
      (v) => v.status === "HIGH"
    ).length,
    color: "#2563eb",
  },

  {
    name: "NORMAL Alerts",
    value: vitals.filter(
      (v) => v.status === "NORMAL"
    ).length,
    color: "#fbbf24",
  },
];
  return (
    <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Patient Vital Trends
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Heart rate, sugar level, and blood pressure
            </p>
          </div>
          <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            Today
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: -20, right: 10, top: 10 }}>
              <CartesianGrid stroke="#e8eefc" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ border: "0", borderRadius: "14px", boxShadow: "0 12px 30px rgba(37,99,235,.12)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#2563eb" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="sugarLevel" name="Sugar Level" stroke="#06b6d4" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="bloodPressure" name="Blood Pressure" stroke="#f59e0b" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800">Alert Distribution</h2>
        <p className="text-xs font-medium text-slate-400">
          High vs normal readings
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={alertsData} dataKey="value" innerRadius={62} outerRadius={94} paddingAngle={5}>
                {alertsData.map((alert) => (
                  <Cell key={alert.name} fill={alert.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: "0", borderRadius: "14px" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default VitalsChart;
