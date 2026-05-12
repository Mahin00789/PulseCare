import { AlertTriangle, Clock } from "lucide-react";

const badgeStyles = {
  Critical: "bg-rose-50 text-rose-700",
  Moderate: "bg-amber-50 text-amber-700",
};

function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
  return (
    <div className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">
      No alerts found
    </div>
  );
}
  return (
    <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Real-Time Alerts
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Recent abnormal patient vitals
          </p>
        </div>
        <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          Live
        </span>
      </div>

      <div className="max-h-[330px] space-y-3 overflow-y-auto pr-1">
        {alerts?.map((alert) => (
          <article
            key={`${alert.patient}-${alert.time}`}
            className="rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <AlertTriangle size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-800">
                    {alert.patient.user.name}
                  </h3>
                  <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${badgeStyles[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {alert.message}
                </p>
                <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Clock size={12} />
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AlertsPanel;
