import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  History,
  Code2,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import useAuthStore from "../store/authStore";

function MainLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const fullName = user?.fullName || "John Doe";
  const email = user?.email || "john.doe@example.com";
  const initial = fullName?.charAt(0)?.toUpperCase() || "U";

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Practice", path: "/interview", icon: Code2 },
    { label: "History", path: "/history", icon: History },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ================= MOBILE MENU OVERLAY ================= */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles size={20} />
            </div>
            <span className="text-lg tracking-tight">PrepPortal</span>
          </Link>

          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={19} className={isActive ? "text-blue-600" : "text-slate-400"} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-blue-600" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile Brief */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">{fullName}</p>
                <p className="truncate text-[11px] text-slate-500">{email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="ml-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-5 backdrop-blur-md sm:px-7 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                {initial}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;