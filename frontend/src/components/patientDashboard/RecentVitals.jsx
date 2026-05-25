import { Trash2 } from "lucide-react";

const statusStyles = {
  HIGH: "bg-rose-50 text-rose-700",
  NORMAL: "bg-emerald-50 text-emerald-700",
};

function RecentVitals({ vitals = [], onDeleteVital }) {
  return (
    <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-800">Recent Vitals</h2>
        <p className="text-xs font-medium text-slate-400">
          Latest submitted readings and status
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Heart Rate</th>
              <th className="px-3 py-2">Sugar Level</th>
              <th className="px-3 py-2">Blood Pressure</th>
              <th className="px-3 py-2">Status</th>
              {onDeleteVital && <th className="px-3 py-2">Action</th>}
            </tr>
          </thead>
          <tbody>
            {vitals && vitals.length > 0 ? (
              vitals.map((vital) => (
                <tr
                  key={vital.id}
                  className="bg-white text-sm shadow-sm transition hover:shadow-md"
                >
                  <td className="rounded-l-xl px-3 py-3 font-bold text-slate-700">
                    {new Date(vital.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-500">
                    {vital.heartRate} bpm
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-500">
                    {vital.sugarLevel} mg/dL
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-500">
                    {vital.bpSystolic}/{vital.bpDiastolic}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                        statusStyles[vital.status] || statusStyles.NORMAL
                      }`}
                    >
                      {vital.status}
                    </span>
                  </td>
                  {onDeleteVital && (
                    <td className="rounded-r-xl px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteVital(vital.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        aria-label="Delete vital"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={onDeleteVital ? 6 : 5}
                  className="py-8 text-center text-sm font-medium text-slate-400"
                >
                  No vitals uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentVitals;
