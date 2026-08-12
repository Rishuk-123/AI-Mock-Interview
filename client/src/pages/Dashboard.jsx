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

  // =========================
  // FETCH INTERVIEWS
  // =========================

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");
        setInterviews(response.data.interviews || []);
      } catch (error) {
        console.error("Dashboard interviews error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // =========================
  // STATISTICS
  // =========================

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed"
  );

  const totalInterviews = interviews.length;
  const completedCount = completedInterviews.length;

  const averageScore =
    completedCount > 0
      ? Math.round(
          completedInterviews.reduce(
            (sum, interview) =>
              sum + (interview.overallScore || 0),
            0
          ) / completedCount
        )
      : 0;

  const bestScore =
    completedCount > 0
      ? Math.max(
          ...completedInterviews.map(
            (interview) => interview.overallScore || 0
          )
        )
      : 0;

  const totalMinutes = interviews.reduce(
    (sum, interview) =>
      sum + (interview.duration || 0),
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
        completedCount > 0
          ? "Your highest score"
          : "No score yet",
      icon: TrendingUp,
    },
  ];

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="text-sm font-medium text-slate-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <MainLayout>
      <div className="w-full min-w-0 max-w-none overflow-hidden">

        {/* =========================
            HEADER
        ========================= */}

        <section className="mb-7">
          <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                AI Interview Platform
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Continue your interview preparation and
                improve your performance with AI-powered
                practice.
              </p>
            </div>

            <Button
              className="w-full shrink-0 sm:w-auto"
              onClick={() => navigate("/interview")}
            >
              Start Interview
              <ArrowRight
                className="ml-2"
                size={17}
              />
            </Button>

          </div>
        </section>

        {/* =========================
            STATISTICS
        ========================= */}

        <section className="mb-7 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="min-w-0 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center justify-between gap-3">

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {item.value}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={22} />
                  </div>

                </div>
              </Card>
            );
          })}

        </section>

        {/* =========================
            PERFORMANCE + CTA
        ========================= */}

        <section className="mb-7 grid w-full min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">

          {/* PERFORMANCE */}

          <Card className="min-w-0 overflow-hidden p-6 shadow-sm">

            <div className="flex min-w-0 items-start justify-between gap-4">

              <div className="min-w-0">
                <div className="flex items-center gap-2">

                  <BarChart3
                    size={20}
                    className="shrink-0 text-blue-600"
                  />

                  <h2 className="truncate text-lg font-semibold text-slate-900">
                    Performance Overview
                  </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Your recent interview performance
                </p>
              </div>

              {completedCount > 0 && (
                <div className="shrink-0 rounded-xl bg-blue-50 px-4 py-2 text-right">

                  <p className="text-xs text-slate-500">
                    Average
                  </p>

                  <p className="text-lg font-bold text-blue-600">
                    {averageScore}%
                  </p>

                </div>
              )}

            </div>

            {/* CHART */}

            {completedInterviews.length === 0 ? (
              <div className="mt-6 flex h-64 flex-col items-center justify-center rounded-xl bg-slate-50 text-center">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                  <BarChart3 size={22} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-600">
                  No performance data yet
                </p>

                <p className="mt-1 max-w-sm px-4 text-xs text-slate-400">
                  Complete your first interview to see
                  your performance here.
                </p>

              </div>
            ) : (
              <div className="mt-6 min-w-0">

                <div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-50 px-5 py-5">

                  {/* GRID */}

                  <div className="absolute left-5 right-5 top-5 border-t border-slate-200" />

                  <div className="absolute left-5 right-5 top-1/2 border-t border-slate-200" />

                  <div className="absolute bottom-10 left-5 right-5 border-t border-slate-200" />

                  {/* BARS */}

                  <div className="relative flex h-full min-w-0 items-end justify-around gap-2">

                    {completedInterviews
                      .slice(0, 6)
                      .reverse()
                      .map((interview, index) => {
                        const score =
                          interview.overallScore || 0;

                        return (
                          <div
                            key={interview._id}
                            className="flex min-w-0 flex-1 flex-col items-center justify-end"
                          >

                            <span className="mb-2 text-xs font-semibold text-slate-600">
                              {score}%
                            </span>

                            <div
                              className="w-full max-w-[56px] rounded-t-lg bg-blue-500 transition-all hover:bg-blue-600"
                              style={{
                                height: `${Math.max(
                                  score * 1.8,
                                  8
                                )}px`,
                              }}
                            />

                            <span className="mt-2 text-[10px] text-slate-400">
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

          {/* START INTERVIEW */}

          <Card className="flex min-w-0 flex-col p-6 shadow-sm">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Target size={22} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              Start a New Interview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Practice with an AI interviewer and receive
              detailed feedback on your performance.
            </p>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">

              <p className="text-sm font-medium text-slate-700">
                Ready to practice?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Choose your role, company, interview type
                and difficulty.
              </p>

            </div>

            <Button
              className="mt-5 w-full"
              onClick={() => navigate("/interview")}
            >
              Start Interview
              <ArrowRight
                className="ml-2"
                size={17}
              />
            </Button>

          </Card>

        </section>

        {/* =========================
            RECENT INTERVIEWS
        ========================= */}

        <section className="w-full min-w-0">

          <Card className="min-w-0 overflow-hidden p-6 shadow-sm">

            <div className="flex min-w-0 items-center justify-between gap-4">

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Interviews
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest interview sessions
                </p>
              </div>

              {interviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  className="flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                  <ChevronRight size={16} />
                </button>
              )}

            </div>

            {interviews.length === 0 ? (

              <div className="mt-6 rounded-xl bg-slate-50 p-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                  <Video size={22} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-600">
                  You haven't created any interviews yet.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Start your first mock interview to begin
                  practicing.
                </p>

                <Button
                  className="mt-5"
                  onClick={() => navigate("/interview")}
                >
                  Start Your First Interview
                </Button>

              </div>

            ) : (

              <div className="mt-6 w-full overflow-x-auto">

                <table className="w-full min-w-[650px] text-left">

                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">

                      <th className="px-3 pb-3">
                        Role
                      </th>

                      <th className="px-3 pb-3">
                        Type
                      </th>

                      <th className="px-3 pb-3">
                        Status
                      </th>

                      <th className="px-3 pb-3">
                        Score
                      </th>

                      <th className="px-3 pb-3">
                        Date
                      </th>

                      <th className="px-3 pb-3">
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {interviews
                      .slice(0, 5)
                      .map((interview) => (

                        <tr
                          key={interview._id}
                          className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50"
                          onClick={() => {
                            if (
                              interview.status ===
                              "completed"
                            ) {
                              navigate(
                                `/interview/${interview._id}/results`
                              );
                            } else {
                              navigate(
                                `/interview/${interview._id}`
                              );
                            }
                          }}
                        >

                          <td className="px-3 py-4">

                            <p className="font-medium text-slate-900">
                              {interview.role}
                            </p>

                            {interview.company && (
                              <p className="mt-1 text-xs text-slate-400">
                                {interview.company}
                              </p>
                            )}

                          </td>

                          <td className="px-3 py-4 text-sm text-slate-500">
                            {interview.interviewType}
                          </td>

                          <td className="px-3 py-4">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                interview.status ===
                                "completed"
                                  ? "bg-green-50 text-green-600"
                                  : interview.status ===
                                    "in-progress"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-yellow-50 text-yellow-600"
                              }`}
                            >
                              {interview.status}
                            </span>

                          </td>

                          <td className="px-3 py-4 text-sm font-semibold">

                            <span
                              className={
                                interview.status ===
                                "completed"
                                  ? "text-slate-700"
                                  : "text-slate-400"
                              }
                            >
                              {interview.status ===
                              "completed"
                                ? `${
                                    interview.overallScore ||
                                    0
                                  }%`
                                : "--"}
                            </span>

                          </td>

                          <td className="px-3 py-4 text-sm text-slate-500">
                            {new Date(
                              interview.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-3 py-4 text-right">

                            <ChevronRight
                              size={18}
                              className="ml-auto text-slate-400"
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