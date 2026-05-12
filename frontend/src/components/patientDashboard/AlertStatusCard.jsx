import { AlertTriangle, RadioTower } from "lucide-react";

function AlertStatusCard({ latestVital }) {

  const alertStatus =
    latestVital?.status || "NORMAL";

  const alertMessage =
    alertStatus === "HIGH"
      ? "Abnormal vitals detected"
      : "No active emergency alert";

  const alertColor =
    alertStatus === "HIGH"
      ? "bg-rose-50 text-rose-700"
      : "bg-emerald-50 text-emerald-700";

  return (

    <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-sm font-bold text-slate-800">
            Alert Status
          </h2>

          <p className="text-xs font-medium text-slate-400">
            Latest monitoring signal
          </p>

        </div>

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">

          <RadioTower size={13} />

          Live

        </span>

      </div>

      <article className="rounded-xl bg-white p-4 shadow-sm">

        <div className="flex gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">

            <AlertTriangle size={19} />

          </div>

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center justify-between gap-2">

              <h3 className="text-sm font-bold text-slate-800">
                Latest Alert
              </h3>

              <span
                className={`rounded-md px-2.5 py-1 text-xs font-bold ${alertColor}`}
              >

                {alertStatus}

              </span>

            </div>

            <p className="mt-2 text-xs font-medium leading-5 text-slate-500">

              {alertMessage}

            </p>

            <p className="mt-3 text-[11px] font-bold text-slate-400">

              {latestVital
                ? new Date(
                    latestVital.createdAt
                  ).toLocaleString()
                : "Live monitoring"}

            </p>

          </div>

        </div>

      </article>

    </section>

  );

}

export default AlertStatusCard;