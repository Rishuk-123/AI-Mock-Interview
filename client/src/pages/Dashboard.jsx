import { useState, useEffect, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token) || localStorage.getItem("token");

  const userEmail = useMemo(() => {
    return (
      user?.email ||
      JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.user
        ?.email ||
      "guest"
    );
  }, [user?.email]);

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch interview records specific to this user account
  useEffect(() => {
    let isMounted = true;

    const fetchUserHistory = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        let serverRecords = [];

        if (token) {
          try {
            const res = await fetch(`${baseUrl}/api/interviews/history`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.interviews)) {
              serverRecords = data.interviews;
            }
          } catch (err) {
            console.warn("Backend fetch failed, checking local user storage:", err);
          }
        }

        // Account-scoped local fallback
        const userStorageKey = `recent_interviews_${userEmail}`;
        const localRecords = JSON.parse(
          localStorage.getItem(userStorageKey) || "[]"
        );

        const combined = [...serverRecords, ...localRecords];
        const unique = Array.from(
          new Map(
            combined.map((item) => [
              item.id || item._id || `${item.role}_${item.date}`,
              item,
            ])
          ).values()
        );

        if (isMounted) {
          setInterviews(unique);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserHistory();

    return () => {
      isMounted = false;
    };
  }, [userEmail, token]);

  // Dynamic calculations
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(
    (i) => i.score !== undefined || i.evaluation || i.status === "completed"
  ).length;

  const validScores = interviews
    .map((i) => i.score ?? i.overallScore ?? i.evaluation?.score)
    .filter((s) => typeof s === "number" && !isNaN(s));

  const avgScore =
    validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 0;

  const bestScore = validScores.length > 0 ? Math.max(...validScores) : 0;
  const practiceTimeHours = (completedInterviews * 0.25).toFixed(1);

  const stats = [
    {
      title: "Total Interviews",
      value: loading ? <Loader2 size={20} className="animate-spin text-blue-600" /> : totalInterviews,
      subtitle: `${completedInterviews} completed`,
      icon: Video,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Average Score",
      value: loading ? <Loader2 size={20} className="animate-spin text-amber-600" /> : `${avgScore}%`,
      subtitle: "Overall performance",
      icon: Trophy,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Practice Time",
      value: loading ? <Loader2 size={20} className="animate-spin text-emerald-600" /> : `${practiceTimeHours}h`,
      subtitle: "Total practice time",
      icon: Clock,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Best Score",
      value: loading ? <Loader2 size={20} className="animate-spin text-indigo-600" /> : `${bestScore}%`,
      subtitle: "Your highest score",
      icon: TrendingUp,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <div className="mx-auto max-w-7xl">
          {/* HERO BANNER */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl shadow-blue-600/10">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md w-fit">
                <Sparkles size={14} /> AI INTERVIEW PLATFORM
              </div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Welcome back{user?.name ? `, ${user.name}` : ""} 👋
              </h1>
              <p className="mt-2 text-sm text-blue-100 sm:text-base">
                Practice smarter with AI-powered mock interviews, instant feedback, and performance tracking.
              </p>
              <button
                type="button"
                onClick={() => navigate("/interview-setup")}
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
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">
                      {stat.value}
                    </div>
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

          {/* PERFORMANCE OVERVIEW & TARGET SKILLS */}
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
                  Average {avgScore}%
                </span>
              </div>

              {interviews.length === 0 ? (
                <div className="flex h-48 items-center justify-center py-8 text-center">
                  <p className="text-xs font-medium text-slate-400">
                    Complete your first interview to generate visual performance stats.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {interviews.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {item.role || "Software Developer"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.date || "Recent"} • {item.difficulty || "Medium"}
                        </p>
                      </div>
                      <span className="text-xs font-black text-blue-600">
                        {item.score ?? item.evaluation?.score ?? 0}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
                  <button
                    key={skill}
                    type="button"
                    onClick={() => navigate("/interview-setup")}
                    className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:border-blue-100"
                  >
                    <span>{skill}</span>
                    <span className="text-blue-600 font-bold">Practice →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}