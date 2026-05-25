import { useEffect,useState } from "react";
import API from "../services/api.js";
import useChat from "../hooks/useChat";
import {
  Activity,
  BellRing,
  ClipboardList,
  HeartPulse,
  UsersRound,
} from "lucide-react";

import ChatPanel from "../components/chat/ChatPanel";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import PatientsTable from "../components/dashboard/PatientsTable";
import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import Topbar from "../components/dashboard/Topbar";
import VitalsChart from "../components/dashboard/VitalsChart";
import socket, { connectSocket } from "../services/socket.js";
function DoctorDashboard() {
  const chat = useChat();
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAlerts: 0,
    unreadAlerts: 0,
    totalVitals: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vitals, setVitals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");

  const fetchPatients = async () => {

  try {

    const res = await API.get(
      "/doctor/patients"
    );

    setPatients(res.data.patients);

  } catch (error) {

    console.log(error);

  }

};
const fetchAlerts = async () => {

  try {

    const res = await API.get(
      "/doctor/alerts"
    );

    setAlerts(res.data.alerts);

  } catch (error) {

    console.log(error);

  }

};
  const fetchActivities = async () => {

  try {

    const res = await API.get(
      "/doctor/activities"
    );

    setActivities(res.data);

  } catch (error) {

    console.log(error);

  }

};
  const fetchDashboardStats = async () => {

    try {

      const res = await API.get(
        "/doctor/dashboard"
      );

      setStats(res.data.stats);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };
  const fetchVitals = async () => {

  try {

    const res = await API.get(
      "/doctor/vitals"
    );

    setVitals(res.data.vitals);

  } catch (error) {

    console.log(error);

  }

};
useEffect(() => {

  connectSocket();
  fetchDashboardStats();
  fetchPatients();
  fetchVitals();
  fetchActivities();
  fetchAlerts();

  socket.on("newAlert", () => {

    fetchDashboardStats();
    fetchPatients();
    fetchVitals();
    fetchActivities();
    fetchAlerts();
  });
  socket.on("doctorAssigned", () => {

  fetchDashboardStats();
  fetchPatients();

});

  return () => {

    socket.off("newAlert");
    socket.off("doctorAssigned");
  };

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

        <Sidebar activeView={activeView} onViewChange={setActiveView} unreadCount={chat.totalUnread} />

        <section className="min-w-0 flex-1 rounded-[28px] bg-white">

          <Topbar />

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
              <ChatPanel role="DOCTOR" chat={chat} />
            </div>
          ) : (
          <div className="space-y-5 px-5 pb-6 lg:px-7">

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <StatsCard
                title="Total Patients"
                value={stats.totalPatients}
                icon={UsersRound}
                accent="blue"
              />

              <StatsCard
                title="Total Alerts"
                value={stats.totalAlerts}
                icon={BellRing}
                accent="rose"
              />

              <StatsCard
                title="Unread Alerts"
                value={stats.unreadAlerts}
                icon={ClipboardList}
                accent="amber"
              />

              <StatsCard
                title="Total Vitals Logged"
                value={stats.totalVitals}
                icon={Activity}
                accent="cyan"
              />

            </section>
            <VitalsChart vitals={vitals}/>

<section className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">

  <AlertsPanel alerts={alerts}/>

  <PatientsTable patients={patients} />

</section>

<section className="grid gap-5 xl:grid-cols-[1fr_0.55fr]">

  <ActivityFeed activities={activities}/>

  <div className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">

    <div className="flex items-center justify-between">

      <div>
        <h2 className="text-sm font-bold text-slate-800">
          Care Summary
        </h2>

        <p className="text-xs font-medium text-slate-400">
          Today's remote monitoring quality
        </p>
      </div>

      <HeartPulse className="text-blue-600" size={22} />

    </div>

    <div className="mt-5 space-y-4">

      {[
  [
    "Stable Patients",
    `${stats.stablePercentage}%`,
    "bg-blue-600",
  ],

  [
    "Critical Risk",
    `${stats.criticalPercentage}%`,
    "bg-rose-500",
  ],
].map(([label, value, color]) => (

        <div key={label}>

          <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">

            <span>{label}</span>

            <span>{value}</span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-blue-50">

            <div
              className={`h-full rounded-full ${color}`}
              style={{ width: value }}
            />

          </div>

        </div>

      ))}

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
export default DoctorDashboard;
