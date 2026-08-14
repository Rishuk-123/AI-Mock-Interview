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
        border-slate-200
        bg-white/95
        px-6
        backdrop-blur
        lg:px-8
      "
    >
      {/* ================================================= */}
      {/* LEFT */}
      {/* ================================================= */}

      <div className="min-w-0">

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Sparkles size={16} />
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-bold text-slate-900">
              AI Mock Interview
            </p>

            <p className="hidden text-[11px] text-slate-400 sm:block">
              Prepare smarter. Interview better.
            </p>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* RIGHT */}
      {/* ================================================= */}

      <div className="flex items-center gap-3">

        {/* Notification */}

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
            border-slate-200
            bg-white
            text-slate-500
            transition-all
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600
          "
        >

          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />

        </button>

        {/* Divider */}

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* User */}

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
            {initial}
          </div>

          <div className="hidden min-w-0 sm:block">

            <p className="max-w-[150px] truncate text-sm font-semibold text-slate-900">
              {user?.fullName || "User"}
            </p>

            <p className="text-[11px] font-medium text-slate-400">
              Candidate
            </p>

          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-400 sm:block"
          />

        </div>

      </div>

    </header>
  );
}

export default Navbar;