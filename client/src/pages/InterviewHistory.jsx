import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  History,
  Building2,
  Calendar,
  Brain,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function InterviewHistory() {
  const navigate = useNavigate();

  // Mock interview history data matching light theme
  const [interviews] = useState([
    {
      id: "1",
      role: "Frontend Developer",
      company: "BlackRock",
      type: "Technical",
      difficulty: "Medium",
      date: "09 Aug 2026",
      score: 80,
      status: "Completed",
    },
    {
      id: "2",
      role: "Frontend Developer",
      company: "Nvidia",
      type: "Technical",
      difficulty: "Medium",
      date: "09 Aug 2026",
      score: null,
      status: "In Progress",
    },
    {
      id: "3",
      role: "Full Stack Engineer",
      company: "Accenture",
      type: "Technical",
      difficulty: "Medium",
      date: "11 Aug 2026",
      score: 0,
      status: "Completed",
    },
  ]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-7 lg:px-8">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Interview History
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Review past sessions, scores, and detailed AI feedback.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
            >
              <Sparkles size={16} /> New Interview
            </button>
          </div>

          {/* INTERVIEW LIST */}
          <div className="space-y-4">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* LEFT DETAILS */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.role}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.status === "Completed"
                          ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border border-blue-100 bg-blue-50 text-blue-600"
                      }`}
                    >
                      {item.status === "Completed" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-slate-400" />
                      {item.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Brain size={14} className="text-slate-400" />
                      {item.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Gauge size={14} className="text-slate-400" />
                      {item.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* RIGHT SCORE & ACTIONS */}
                <div className="flex items-center gap-6 sm:shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Score
                    </p>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {item.score !== null ? `${item.score}` : "--"}
                      {item.score !== null && (
                        <span className="text-xs font-normal text-slate-400">
                          /100
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/interview/${item.id}/results`)}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 transition hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}