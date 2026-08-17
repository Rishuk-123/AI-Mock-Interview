import { useNavigate, useParams } from "react"
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function InterviewResults() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-7 lg:px-8">
          {/* TOP BAR */}
          <button
            onClick={() => navigate("/history")}
            className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} /> Back to History
          </button>

          {/* HEADER CARD */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                Session Completed
              </span>
              <h1 className="mt-3 text-2xl font-extrabold text-slate-900">
                Frontend Developer Mock Interview
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Session ID: #{id || "1024"} • Completed on Aug 15, 2026
              </p>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-extrabold text-emerald-600 border border-emerald-100">
                80%
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Overall Score
                </p>
                <p className="text-sm font-bold text-slate-900">Great Job!</p>
              </div>
            </div>
          </div>

          {/* AI FEEDBACK BREAKDOWN */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* STRENGTHS */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-bold text-emerald-600 mb-4">
                <CheckCircle2 size={18} /> Key Performance Strengths
              </h3>
              <ul className="space-y-3 text-xs font-medium text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Strong understanding of React state hooks and lifecycle management.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Clear explanation of DOM optimization strategies.
                </li>
              </ul>
            </div>

            {/* IMPROVEMENTS */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-bold text-amber-600 mb-4">
                <AlertCircle size={18} /> Areas for Improvement
              </h3>
              <ul className="space-y-3 text-xs font-medium text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Elaborate more on error handling boundaries in React components.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Provide concrete real-world metrics when describing web performance gains.
                </li>
              </ul>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
            >
              <RotateCcw size={16} /> Practice Again
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}