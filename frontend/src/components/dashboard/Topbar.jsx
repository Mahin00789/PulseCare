import { Bell, CalendarDays, Menu, Search, Wifi } from "lucide-react";

function Topbar() {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4 rounded-t-[28px] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-7">
      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 lg:hidden">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-400">
            PulseCare remote monitoring overview
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-56">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
            size={16}
          />
          <input
            className="h-10 w-full rounded-xl border border-blue-50 bg-[#f5f7ff] pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-300 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50"
            placeholder="Search"
            type="search"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
          <Wifi size={15} />
          Live
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#f5f7ff] px-3 py-2 text-xs font-bold text-slate-500">
          <CalendarDays size={15} />
          {date}
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f7ff] text-slate-500 transition hover:text-blue-700">
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
