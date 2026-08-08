import {
  LayoutDashboard,
  Video,
  History,
  FileText,
  User,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

function Sidebar() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Start Interview",
      path: "/interview",
      icon: Video,
    },
    {
      name: "Interview History",
      path: "/history",
      icon: History,
    },
    {
      name: "Resume",
      path: "/resume",
      icon: FileText,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "280px",
        height: "100vh",
        zIndex: 40,
      }}
      className="flex flex-col border-r border-slate-200 bg-white"
    >
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-6">
        <h1 className="text-xl font-bold text-slate-900">AI Interview</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
