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

  // Close menus when clicking outside
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

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-6 backdrop-blur lg:px-8">
      {/* LEFT: Logo / Branding */}
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-800/50 bg-blue-950 text-blue-400">
            <Sparkles size={16} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              AI Mock Interview
            </p>
            <p className="hidden text-[11px] text-slate-400 sm:block">
              Prepare smarter. Interview better.
            </p>
          </div>
        </button>
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsDropdownOpen(false);
            }}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-slate-700 hover:text-white focus:outline-none"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="py-4 text-center text-xs text-slate-400">
                No new notifications.
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-800 sm:block" />

        {/* User Profile Container */}
        <div className="relative flex items-center gap-1" ref={dropdownRef}>
          {/* Direct Profile Click Target (Initial 'J' + User Details) */}
          <button
            type="button"
            onClick={handleProfileClick}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800/50 bg-slate-900/40 p-1.5 transition-all hover:border-slate-700 hover:bg-slate-900 focus:outline-none"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/20 font-bold uppercase text-blue-400 shadow-sm">
              {initial}
            </div>

            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-white">
                {user?.fullName || "User"}
              </p>
              <p className="text-[11px] font-medium capitalize text-slate-400">
                {user?.role || "Candidate"}
              </p>
            </div>
          </button>

          {/* Chevron Toggle Button for Dropdown Menu */}
          <button
            type="button"
            onClick={() => {
              setIsDropdownOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            aria-label="Toggle user menu"
            className="hidden p-2 text-slate-500 transition-colors hover:text-white focus:outline-none sm:block"
          >
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl backdrop-blur-md">
              <div className="border-b border-slate-800 px-3 py-2">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.fullName || "User"}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {user?.email || "candidate@example.com"}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 pt-1">
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <UserIcon size={16} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
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