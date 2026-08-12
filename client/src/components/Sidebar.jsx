import {
  LayoutDashboard,
  Video,
  History,
  FileText,
  User,
  LogOut,
  Sparkles,
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-[72px] shrink-0 items-center border-b border-slate-100 px-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Sparkles size={18} />
          </div>

          <div>
            <h1 className="text-[17px] font-bold tracking-tight text-slate-900">
              AI Interview
            </h1>

            <p className="text-[11px] font-medium text-slate-400">
              Smart interview practice
            </p>
          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg transition",
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "text-slate-400 group-hover:text-slate-600",
                      ].join(" ")}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>

                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}

        </div>

      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-slate-100 p-3">

        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >

          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition group-hover:text-red-500">
            <LogOut size={18} />
          </div>

          <span>Logout</span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;