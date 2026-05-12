import { useState, useEffect } from "react";

import API from "../../services/api.js";

import {
  Activity,
  Bell,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  RadioTower,
  Settings,
  UsersRound,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, view: "dashboard" },
  { label: "Chat", icon: MessageCircle, view: "chat" },
  { label: "Patients", icon: UsersRound },
  { label: "Alerts", icon: Bell },
  { label: "Vitals Analytics", icon: Activity },
  { label: "Real-Time Monitoring", icon: RadioTower },
  { label: "Settings", icon: Settings },
  { label: "Logout", icon: LogOut },
];

function Sidebar({ activeView = "dashboard", onViewChange, unreadCount = 0 }) {

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {

    const fetchDoctorProfile = async () => {

      try {

        const res = await API.get("/doctor/profile");

        setDoctor(res.data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchDoctorProfile();

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/login";

  };

  return (

    <aside className="hidden w-48 shrink-0 rounded-l-[28px] bg-white px-5 py-6 shadow-sm lg:block">

      <div className="flex flex-col items-center border-b border-blue-50 pb-7 text-center">

        <div className="relative">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-2 shadow-lg shadow-blue-100">

            <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-white">

              <HeartPulse size={38} />

            </div>

          </div>

          <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />

        </div>

        <h2 className="mt-4 text-sm font-bold text-slate-900">

          {doctor?.name || "Doctor"}

        </h2>

        <p className="mt-1 text-[11px] font-medium leading-4 text-blue-500">

          {doctor?.role || "DOCTOR"}

        </p>

      </div>

      <nav className="mt-8 space-y-2">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.label}
              type="button"
              onClick={
                item.label === "Logout"
                  ? handleLogout
                  : item.view
                    ? () => onViewChange?.(item.view)
                    : undefined
              }
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition duration-200 ${
                item.view === activeView
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >

              <Icon size={16} />

              <span>{item.label}</span>

              {item.label === "Chat" && unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}

            </button>

          );

        })}

      </nav>

    </aside>

  );

}

export default Sidebar;
