import { Bell, CalendarDays, HeartPulse, Menu, Wifi } from "lucide-react";

function PatientTopbar({ patient }) {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4 rounded-t-[28px] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-7">
      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 lg:hidden"
          type="button"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Patient Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <Wifi size={13} />
              Live
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400">
            Personal remote monitoring overview
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-[#f5f7ff] px-3 py-2 text-xs font-bold text-slate-500">
          <CalendarDays size={15} />
          {date}
        </div>

        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f7ff] text-slate-500 transition hover:text-blue-700"
          type="button"
        >
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-100">
          <span className="sr-only">{patient?.user?.name || "Patient"}</span>
          <HeartPulse size={18} />
        </div>
      </div>
    </header>
  );
}

export default PatientTopbar;
