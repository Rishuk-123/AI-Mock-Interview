import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Trophy,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BarChart3,
  Target,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const stats = [
    {
      title: "Total Interviews",
      value: "16",
      subtitle: "6 completed",
      icon: Video,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Average Score",
      value: "13%",
      subtitle: "Overall performance",
      icon: Trophy,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Practice Time",
      value: "0.0h",
      subtitle: "Total practice time",
      icon: Clock,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Best Score",
      value: "80%",
      subtitle: "Your highest score",
      icon: TrendingUp,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl">
          {/* HERO BANNER */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl shadow-blue-600/10">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md w-fit">
                <Sparkles size={14} /> AI INTERVIEW PLATFORM
              </div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Welcome back 👋
              </h1>
              <p className="mt-2 text-sm text-blue-100 sm:text-base">
                Practice smarter with AI-powered mock interviews, instant feedback, and performance tracking.
              </p>
              <button
                onClick={() => navigate("/interview")}
                className="mt-6 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 shadow-md transition hover:bg-blue-50 active:scale-95"
              >
                <Video size={18} />
                Start Interview
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* METRICS GRID */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.color}`}
                  >
                    <IconComponent size={22} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* PERFORMANCE OVERVIEW */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Performance Overview
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your recent interview performance
                    </p>
                  </div>
                </div>
                <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Average 13%
                </span>
              </div>

              <div className="flex h-48 items-center justify-center py-8 text-center">
                <p className="text-xs font-medium text-slate-400">
                  Complete more interviews to generate visual performance charts.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Target Skills
                  </h3>
                  <p className="text-xs text-slate-500">
                    Recommended focus areas
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {["React.js", "Node.js", "System Design"].map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700"
                  >
                    <span>{skill}</span>
                    <span className="text-blue-600 font-bold">Practice →</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}