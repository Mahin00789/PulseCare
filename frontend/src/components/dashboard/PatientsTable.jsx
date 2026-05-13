import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
const statusStyles = {
  HIGH: "bg-rose-50 text-rose-700",
  NORMAL: "bg-emerald-50 text-emerald-700",
};

function PatientsTable({ patients }) {
  const navigate = useNavigate();
  if (!patients || patients.length === 0) {
    return (
      <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800">
          Assigned Patients
        </h2>

        <div className="mt-6 flex items-center justify-center rounded-xl bg-white p-8 text-sm font-semibold text-slate-400">
          No patients found
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Assigned Patients
          </h2>

          <p className="text-xs font-medium text-slate-400">
            Patient monitoring table
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-blue-100 transition hover:bg-blue-700">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left">

          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2">Patient Name</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">Gender</th>
              <th className="px-3 py-2">Blood Group</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Details</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => {
              // console.log(patient);
              const latestVital =
                patient.vitals?.length > 0
                  ? patient.vitals[0]
                  : null;

              return (
                <tr
                  key={patient.id}
                  className="bg-white text-sm shadow-sm transition hover:shadow-md"
                >

                  <td className="rounded-l-xl px-3 py-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {patient.user?.name?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {patient.user?.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {patient.user?.email}
                        </p>
                      </div>

                    </div>

                  </td>

                  <td className="px-3 py-3 font-medium text-slate-500">
                    {patient.age}
                  </td>

                  <td className="px-3 py-3 font-medium text-slate-500">
                    {patient.gender}
                  </td>

                  <td className="px-3 py-3 font-bold text-slate-700">
                    {patient.bloodGroup}
                  </td>

                  <td className="px-3 py-3">

                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                        latestVital?.status === "HIGH"
                          ? statusStyles.HIGH
                          : statusStyles.NORMAL
                      }`}
                    >
                      {latestVital?.status || "NORMAL"}
                    </span>

                  </td>

                  <td className="rounded-r-xl px-3 py-3">

                    <button
  onClick={() =>
    navigate(`/doctor/patient/${patient.id}`)
  }
  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 px-2.5 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
>
  <Eye size={14} />
  View Details
</button>

                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </section>
  );
}

export default PatientsTable;