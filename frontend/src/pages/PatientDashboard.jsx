import { useEffect, useState } from "react";
import API from "../services/api.js";
import toast from "react-hot-toast";
import {
  Activity,
  Droplets,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import ChatPanel from "../components/chat/ChatPanel";
import useChat from "../hooks/useChat";
import AlertStatusCard from "../components/patientDashboard/AlertStatusCard";
import DoctorCard from "../components/patientDashboard/DoctorCard";
import HealthChart from "../components/patientDashboard/HealthChart";
import PatientSidebar from "../components/patientDashboard/PatientSidebar";
import PatientStatsCard from "../components/patientDashboard/PatientStatsCard";
import PatientTopbar from "../components/patientDashboard/PatientTopbar";
import RecentVitals from "../components/patientDashboard/RecentVitals";
import VitalsForm from "../components/patientDashboard/VitalsForm";

const healthTrendData = [
  { label: "Mon", heartRate: 74, sugarLevel: 108, bloodPressure: 118 },
  { label: "Tue", heartRate: 78, sugarLevel: 112, bloodPressure: 121 },
  { label: "Wed", heartRate: 76, sugarLevel: 106, bloodPressure: 119 },
  { label: "Thu", heartRate: 82, sugarLevel: 118, bloodPressure: 124 },
  { label: "Fri", heartRate: 79, sugarLevel: 111, bloodPressure: 120 },
  { label: "Sat", heartRate: 77, sugarLevel: 109, bloodPressure: 117 },
];

function PatientDashboard() {
  const chat = useChat();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const latestVital = vitals[0];

  const fetchVitals = async () => {
    try {
      const res = await API.get(`/vitals/${patient.id}`);
      setVitals(res.data.vitals);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteVital = async (vitalId) => {
    const confirmed = window.confirm("Delete this vital record? This cannot be undone.");
    if (!confirmed) return;

    try {
      await API.delete(`/vitals/${vitalId}`);
      toast.success("Vital record deleted successfully.");
      fetchVitals();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to delete vital.");
    }
  };

  useEffect(() => {
  const loadPatientDashboard = async () => {

    try {

      const profileRes = await API.get(
        "/patient/profile"
      );

      setPatient(profileRes.data);

      const vitalsRes = await API.get(
        `/vitals/${profileRes.data.id}`
      );

      setVitals(vitalsRes.data.vitals);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  loadPatientDashboard();

}, []);
if (loading) {

  return (

    <div className="flex min-h-screen items-center justify-center text-lg font-bold text-slate-600">

      Loading...

    </div>

  );

}
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dce8ff_0,#eaf3ff_42%,#f8fbff_100%)] p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl rounded-[28px] bg-white/70 shadow-2xl shadow-blue-200/70 ring-1 ring-white/80">
        <PatientSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          patient={patient}
          unreadCount={chat.totalUnread}
        />

        <section className="min-w-0 flex-1 rounded-[28px] bg-white">
          <PatientTopbar patient={patient} />

          <div className="flex gap-2 px-5 pb-4 lg:hidden">
            {["dashboard", "chat"].map((view) => (
              <button
                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize ${
                  activeView === view
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700"
                }`}
                key={view}
                onClick={() => setActiveView(view)}
                type="button"
              >
                {view}
              </button>
            ))}
          </div>

          {activeView === "chat" ? (
            <div className="px-5 pb-6 lg:px-7">
              <ChatPanel role="PATIENT" chat={chat} />
            </div>
          ) : (
          <div className="space-y-5 px-5 pb-6 lg:px-7">
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">


  <PatientStatsCard
  title="Heart Rate"
  value={
    latestVital
      ? `${latestVital.heartRate} bpm`
      : "-- bpm"
  }
  subtitle="Latest reading"
  icon={HeartPulse}
  accent="blue"
/>

<PatientStatsCard
  title="Blood Pressure"
  value={
    latestVital
      ? `${latestVital.bpSystolic}/${latestVital.bpDiastolic}`
      : "--/--"
  }
  subtitle="Latest reading"
  icon={Activity}
  accent="cyan"
/>

<PatientStatsCard
  title="Sugar Level"
  value={
    latestVital
      ? `${latestVital.sugarLevel} mg/dL`
      : "-- mg/dL"
  }
  subtitle="Latest reading"
  icon={Droplets}
  accent="amber"
/>

<PatientStatsCard
  title="Health Status"
  value={
    latestVital?.status || "Pending"
  }
  subtitle="Based on latest vitals"
  icon={ShieldCheck}
  accent={
    latestVital?.status === "HIGH"
      ? "rose"
      : "emerald"
  }
/>

</section>

            <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
              <HealthChart vitals={vitals} />

              <div className="grid gap-5">
                <AlertStatusCard latestVital={latestVital}/>
                <DoctorCard patient={patient}  />
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
              <VitalsForm patient={patient} fetchVitals={fetchVitals} />
              <RecentVitals vitals={vitals} onDeleteVital={handleDeleteVital} />
            </section>

            <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Real-Time Monitoring
                  </h2>
                  <p className="text-xs font-medium text-slate-400">
                    Device connection and backend sync indicators
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {["Vitals stream", "Alert listener", "Doctor review"].map(
                    (label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm"
                      >
                        <Stethoscope size={14} className="text-blue-600" />
                        {label}
                      </span>
                    )
                  )}
                </div>
              </div>
            </section>
          </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default PatientDashboard;
