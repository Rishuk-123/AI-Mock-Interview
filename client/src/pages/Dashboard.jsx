import { useEffect, useState } from "react";
import {
  Video,
  Clock,
  Trophy,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Target,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");

        setInterviews(response.data.interviews || []);
      } catch (error) {
        console.error("Dashboard interviews error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed"
  );

  const totalInterviews = interviews.length;
  const completedCount = completedInterviews.length;

  const averageScore =
    completedCount > 0
      ? Math.round(
          completedInterviews.reduce(
            (sum, interview) => sum + (interview.overallScore || 0),
            0
          ) / completedCount
        )
      : 0;

  const bestScore =
    completedCount > 0
      ? Math.max(
          ...completedInterviews.map((interview) => interview.overallScore || 0)
        )
      : 0;

  const totalMinutes = interviews.reduce(
    (sum, interview) => sum + (interview.duration || 0),
    0
  );

  const practiceHours = (totalMinutes / 60).toFixed(1);

  const statistics = [
    {
      title: "Total Interviews",
      value: totalInterviews,
      description: `${completedCount} completed`,
      icon: Video,
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      description:
        completedCount > 0
          ? "Overall performance"
          : "No completed interviews",
      icon: Trophy,
    },
    {
      title: "Practice Time",
      value: `${practiceHours}h`,
      description: "Total practice time",
      icon: Clock,
    },
    {
      title: "Best Score",
      value: `${bestScore}%`,
      description:
        completedCount > 0 ? "Your highest score" : "No score yet",
      icon: TrendingUp,
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }

    if (status === "in-progress") {
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    }

    return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  };

  const getStatusText = (status) => {
    if (status === "completed") {
      return "Completed";
    }

    if (status === "in-progress") {
      return "In Progress";
    }

    return "Scheduled";
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[500px] items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />
            <p className="text-sm font-medium text-slate-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full bg-slate-950 text-white min-h-screen p-6">
        {/* WELCOME HEADER */}
        <section className="mb-7">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 px-7 py-8 shadow-xl border border-blue-500/20 sm:px-9">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-blue-400/10 blur-xl" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-2 text-blue-200">
                  <Sparkles size={18} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    AI Interview Platform
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Welcome back 👋
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                  Practice smarter with AI-powered mock interviews, instant feedback,
                  and performance tracking.
                </p>
              </div>

              <Button
                onClick={() => navigate("/interview")}
                className="h-11 shrink-0 bg-white px-5 font-semibold text-blue-700 hover:bg-blue-50 shadow-lg"
              >
                <Video size={17} className="mr-2" />
                Start Interview
                <ArrowRight size={17} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="group border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      {item.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/50 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        {/* PERFORMANCE + CTA */}
        <section className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          {/* PERFORMANCE */}
          <Card className="overflow-hidden border-slate-800 bg-slate-900/80 p-6 shadow-lg backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
                    <BarChart3 size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    Performance Overview
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Your recent interview performance
                </p>
              </div>

              {completedCount > 0 && (
                <div className="rounded-xl border border-blue-900/50 bg-blue-950/60 px-4 py-2 text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Average
                  </p>
                  <p className="text-lg font-bold text-blue-400">
                    {averageScore}%
                  </p>
                </div>
              )}
            </div>

            {completedInterviews.length === 0 ? (
              <div className="mt-6 flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/50 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-slate-400 border border-slate-800">
                  <BarChart3 size={22} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-300">
                  No performance data yet
                </p>
                <p className="mt-1 max-w-sm px-4 text-xs leading-5 text-slate-500">
                  Complete your first interview to see your performance here.
                </p>

                <Button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white" onClick={() => navigate("/interview")}>
                  Start Interview
                </Button>
              </div>
            ) : (
              <div className="mt-6">
                <div className="relative h-64 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60 p-5">
                  <div className="absolute left-5 right-5 top-5 border-t border-slate-800/60" />
                  <div className="absolute left-5 right-5 top-1/2 border-t border-slate-800/60" />
                  <div className="absolute bottom-10 left-5 right-5 border-t border-slate-800/60" />

                  <div className="relative flex h-full items-end justify-around gap-3">
                    {completedInterviews
                      .slice(0, 6)
                      .reverse()
                      .map((interview, index) => {
                        const score = interview.overallScore || 0;

                        return (
                          <div
                            key={interview._id}
                            className="flex min-w-0 flex-1 flex-col items-center justify-end"
                          >
                            <span className="mb-2 text-xs font-bold text-slate-300">
                              {score}%
                            </span>

                            <div
                              className="w-full max-w-[58px] rounded-t-lg bg-blue-600 transition-all hover:bg-blue-500"
                              style={{
                                height: `${Math.max(score * 1.7, 8)}px`,
                              }}
                            />

                            <span className="mt-2 text-[10px] text-slate-500">
                              #{index + 1}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* CTA */}
          <Card className="relative overflow-hidden border-slate-800 bg-slate-900/80 p-6 shadow-lg backdrop-blur">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-600/10 blur-xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Target size={22} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                Ready to practice?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Start a personalized mock interview and receive AI-powered
                feedback on every answer.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  Role-specific questions
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  AI-powered evaluation
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  Detailed performance report
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                onClick={() => navigate("/interview")}
              >
                Start Interview
                <ArrowRight size={17} className="ml-2" />
              </Button>
            </div>
          </Card>
        </section>

        {/* RECENT INTERVIEWS */}
        <section>
          <Card className="overflow-hidden border-slate-800 bg-slate-900/80 p-0 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Recent Interviews
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your latest interview sessions
                </p>
              </div>

              {interviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  className="flex items-center gap-1 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  View all
                  <ChevronRight size={16} />
                </button>
              )}
            </div>

            {interviews.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-slate-500 border border-slate-800">
                  <Video size={24} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-300">
                  No interviews yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Start your first mock interview to begin practicing.
                </p>

                <Button
                  className="mt-5 bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={() => navigate("/interview")}
                >
                  Start Your First Interview
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/50 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <th className="px-6 py-4">Interview</th>
                      <th className="px-4 py-4">Type</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Score</th>
                      <th className="px-4 py-4">Date</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/60">
                    {interviews.slice(0, 5).map((interview) => (
                      <tr
                        key={interview._id}
                        className="cursor-pointer transition hover:bg-slate-800/50"
                        onClick={() => {
                          if (interview.status === "completed") {
                            navigate(
                              `/interview/${interview._id}/results`
                            );
                          } else {
                            navigate(`/interview/${interview._id}`);
                          }
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/40">
                              <Video size={18} />
                            </div>

                            <div>
                              <p className="font-semibold text-white">
                                {interview.role || "Interview"}
                              </p>

                              {interview.company && (
                                <p className="mt-1 text-xs text-slate-400">
                                  {interview.company}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-400">
                          {interview.interviewType || "—"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              interview.status
                            )}`}
                          >
                            {getStatusText(interview.status)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`text-sm font-bold ${
                              interview.status === "completed"
                                ? "text-white"
                                : "text-slate-500"
                            }`}
                          >
                            {interview.status === "completed"
                              ? `${interview.overallScore || 0}%`
                              : "--"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-400">
                          {interview.createdAt
                            ? new Date(
                                interview.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-4">
                          <ChevronRight
                            size={18}
                            className="ml-auto text-slate-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}

export default Dashboard;