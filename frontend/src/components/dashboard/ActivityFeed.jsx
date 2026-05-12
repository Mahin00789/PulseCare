function ActivityFeed({ activities }) {

  return (

    <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">

      <div className="mb-4">

        <h2 className="text-sm font-bold text-slate-800">
          Recent Activity
        </h2>

        <p className="text-xs font-medium text-slate-400">
          Latest patient vitals activity
        </p>

      </div>

      <div className="space-y-3">

        {activities.map((activity) => (

          <div
            key={activity.id}
            className="rounded-xl bg-white p-4 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <h3 className="text-sm font-bold text-slate-800">
                {activity.patientName}
              </h3>

              <span
                className={`rounded-md px-2 py-1 text-xs font-bold ${
                  activity.status === "HIGH"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {activity.status}
              </span>

            </div>

            <div className="mt-2 text-xs text-slate-500 space-y-1">

              <p>
                Heart Rate: {activity.heartRate}
              </p>

              <p>
                Sugar Level: {activity.sugarLevel}
              </p>

              <p>
                Blood Pressure: {activity.bloodPressure}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

export default ActivityFeed;