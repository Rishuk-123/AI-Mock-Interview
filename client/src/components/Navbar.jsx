import { Bell } from "lucide-react";

import useAuthStore from "../store/authStore";

function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Track your interview preparation
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">
              {user?.fullName || "User"}
            </p>

            <p className="text-xs text-slate-500">
              Candidate
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;