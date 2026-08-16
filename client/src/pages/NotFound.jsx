import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileQuestion, Sparkles } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 font-sans text-white antialiased">
      {/* Top Navigation */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-slate-800/80 px-6 py-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20">
            <Sparkles size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            PrepPortal
          </span>
        </Link>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-slate-400 hover:text-white transition"
        >
          ← Go Back
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-950/80 text-blue-400 border border-blue-800/50 shadow-xl shadow-blue-600/10">
          <FileQuestion size={40} />
        </div>

        <span className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
          Error 404
        </span>

        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Page Not Found
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
          Sorry, the page you are looking for doesn't exist or has been moved to a new URL.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PrepPortal. All rights reserved.
      </footer>
    </div>
  );
}

export default NotFound;