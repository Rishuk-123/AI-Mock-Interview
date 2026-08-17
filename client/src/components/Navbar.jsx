import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Sparkles,
  LogOut,
  User as UserIcon,
  X,
} from "lucide-react";
import useAuthStore from "../store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const initial = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileNavigate = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur lg:px-8">
      {/* BRANDING */}
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-3 text-left focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
            <Sparkles size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-900">
              AI Mock Interview
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Prepare smarter. Interview better.
            </p>
          </div>
        </button>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationsOpen((prev) => !prev);
              setIsDropdownOpen(false);
            }}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <p className="text-sm font-bold text-slate-900">Notifications</p>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="py-6 text-center text-xs font-medium text-slate-500">
                No new notifications.
              </div>
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        {/* USER PROFILE */}
        <div className="relative flex items-center gap-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleProfileNavigate}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-bold uppercase text-white shadow-sm">
              {initial}
            </div>

            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                {user?.fullName || "User"}
              </p>
              <p className="text-[11px] font-medium capitalize text-slate-500">
                {user?.role || "Candidate"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            aria-label="Toggle user menu"
            className="hidden p-2 text-slate-400 transition-colors hover:text-slate-700 focus:outline-none sm:block"
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.fullName || "User"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email || "candidate@example.com"}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 pt-1">
                <button
                  type="button"
                  onClick={handleProfileNavigate}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <UserIcon size={16} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;