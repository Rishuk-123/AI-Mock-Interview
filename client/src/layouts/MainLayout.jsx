import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  History,
  FileText,
  User,
  LogOut,
  Bell,
  Sparkles,
} from "lucide-react";
import useAuthStore from "../store/authStore";

function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Practice", path: "/interview", icon: Video },
    { label: "History", path: "/history", icon: History },
    { label: "Resume", path: "/resume", icon: FileText },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-white antialiased">
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800/80 bg-slate-950 p-6">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center space-x-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            PrepPortal
          </span>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-slate-800/80 bg-slate-950/80 px-8 backdrop-blur">
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:text-white"
            >
              <Bell size={18} />
            </button>

            {/* User Avatar & Logout */}
            <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 font-bold text-blue-400 border border-blue-500/30">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 bg-slate-950 p-6">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;