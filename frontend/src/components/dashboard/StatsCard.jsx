function StatsCard({ title, value, detail, icon: Icon, accent = "blue" }) {
  const accents = {
    blue: "bg-blue-600 text-white shadow-blue-200",
    cyan: "bg-cyan-500 text-white shadow-cyan-200",
    amber: "bg-amber-400 text-white shadow-amber-100",
    rose: "bg-rose-500 text-white shadow-rose-100",
  };

  return (
    <article className="group rounded-2xl border border-blue-50 bg-[#f4f7ff] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-blue-100">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg ${accents[accent]}`}
        >
          <Icon size={26} strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-400">{detail}</p>
        </div>
      </div>
    </article>
  );
}

export default StatsCard;
