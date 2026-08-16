import {
  LayoutDashboard,
  Video,
  History,
  FileText,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
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
    <div className="flex h-full w-full flex-col border-r border-slate-800/80 bg-slate-950 text-white">
      {/* Logo */}
      <div className="flex h-24 shrink-0 items-center border-b border-slate-800/80 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              AI Interview
            </h1>
            <p className="text-xs text-slate-400">
              Smart interview practice
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Navigation */}
      <nav className="px-3 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
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
                  `group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-white"
                        }
                      />
                      <span>{item.name}</span>
                    </div>

                    {isActive && <ChevronRight size={17} />}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <div className="border-t border-slate-800/80 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;