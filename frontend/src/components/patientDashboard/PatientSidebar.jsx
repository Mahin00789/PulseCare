import {
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  FileText,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, view: "dashboard" },
  { label: "AI Symptom Checker", icon: HeartPulse, path: "/patient/symptom-checker" },
  { label: "Symptom History", icon: HeartPulse, path: "/patient/symptom-history" },
  { label: "Prescriptions", icon: FileText, path: "/patient/prescriptions" },
  { label: "Chat", icon: MessageCircle, view: "chat" },
  { label: "Logout", icon: LogOut },
];

function PatientSidebar({ activeView = "dashboard", onViewChange, patient, unreadCount = 0 }) {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/login";

  };

  return (

    <aside className="hidden w-52 shrink-0 rounded-l-[28px] bg-white px-5 py-6 shadow-sm lg:block">

      <div className="flex flex-col items-center border-b border-blue-50 pb-7 text-center">

        <div className="relative">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 p-2 shadow-lg shadow-blue-100">

            <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-white">

              <HeartPulse size={38} />

            </div>

          </div>

          <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />

        </div>

        <h2 className="mt-4 text-sm font-bold text-slate-900">

          {patient?.user?.name || "Patient Name"}

        </h2>

        <p className="mt-1 text-[11px] font-bold leading-4 text-blue-500">

          PATIENT

        </p>

      </div>

      <nav className="mt-8 space-y-2">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (item.label === "Logout") {
                  handleLogout();
                } else if (item.path) {
                  navigate(item.path);
                } else {
                  onViewChange?.(item.view);
                }
              }}
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

export default PatientSidebar;
