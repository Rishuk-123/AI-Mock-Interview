import {
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import useAuthStore from "../store/authStore";

function Navbar() {
  const user = useAuthStore((state) => state.user);

  const firstName =
    user?.fullName?.split(" ")[0] || "there";

  const initial =
    user?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur lg:px-8">

      {/* Left */}
      <div className="min-w-0">

        <div className="flex items-center gap-2">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Sparkles size={14} />
          </div>

          <p className="text-sm font-semibold text-slate-900">
            AI Mock Interview
          </p>

        </div>

        <p className="mt-0.5 hidden text-xs text-slate-400 sm:block">
          Prepare smarter. Interview better.
        </p>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        {/* Divider */}
        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        {/* User */}
        <button
          type="button"
          className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
        >

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
            {initial}
          </div>

          <div className="hidden text-left sm:block">
            <p className="max-w-[150px] truncate text-sm font-semibold text-slate-900">
              {user?.fullName || "User"}
            </p>

            <p className="text-[11px] font-medium text-slate-400">
              Candidate
            </p>
          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-400 transition group-hover:text-slate-600 sm:block"
          />

        </button>

      </div>

    </header>
  );
}

export default Navbar;