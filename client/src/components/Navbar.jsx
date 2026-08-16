import {
  Bell,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import useAuthStore from "../store/authStore";

function Navbar() {
  const user = useAuthStore((state) => state.user);

  const initial =
    user?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-[72px]
        items-center
        justify-between
        border-b
        border-slate-800/80
        bg-slate-950/80
        px-6
        backdrop-blur
        lg:px-8
      "
    >
      {/* LEFT */}
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800/50">
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
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* Notification Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            text-slate-400
            transition-all
            hover:border-slate-700
            hover:text-white
          "
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-800 sm:block" />

        {/* User Badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 font-bold text-blue-400 border border-blue-500/30 shadow-sm">
            {initial}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-[150px] truncate text-sm font-semibold text-white">
              {user?.fullName || "User"}
            </p>

            <p className="text-[11px] font-medium text-slate-400">
              Candidate
            </p>
          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-500 sm:block"
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;