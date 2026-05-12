import { useEffect, useState } from "react";

import API from "../../services/api";

import {
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

function DoctorCard({ patient }) {

  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {

    try {

      const res = await API.get("/doctor/all");

      setDoctors(res.data.doctors);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    if (!patient?.doctor?.name) {

      fetchDoctors();

    }

  }, []);

  const handleAssignDoctor = async (doctorId) => {

    try {

      const res = await API.put(
        "/patient/assign-doctor",
        { doctorId }
      );

      alert(res.data.message);

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return (

    <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">

      <div className="mb-4">

        <h2 className="text-sm font-bold text-slate-800">
          Assigned Doctor
        </h2>

        <p className="text-xs font-medium text-slate-400">
          Connected care provider
        </p>

      </div>

      {patient?.doctor?.name ? (

        <div className="rounded-xl bg-white p-4 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 p-1.5">

              <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-white">

                <Stethoscope size={25} />

              </div>

            </div>

            <div className="min-w-0 flex-1">

              <h3 className="truncate text-sm font-bold text-slate-800">

                {patient.doctor.name}

              </h3>

              <p className="mt-1 text-xs font-medium text-slate-400">

                Remote Healthcare Specialist

              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">

                <CheckCircle2 size={13} />

                Available

              </span>

            </div>

          </div>

        </div>

      ) : (

        <div className="space-y-3">

          {doctors.map((doctor) => (

            <div
              key={doctor.id}
              className="rounded-xl bg-white p-4 shadow-sm"
            >

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">

                    <Stethoscope size={20} />

                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-slate-800">

                      {doctor.name}

                    </h3>

                    <p className="text-xs text-slate-400">

                      {doctor.email}

                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    handleAssignDoctor(doctor.id)
                  }
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                >

                  Assign

                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>

  );

}

export default DoctorCard;