import { useEffect, useState } from "react";
import {
  Video,
  Clock,
  Trophy,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Target,
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
          error.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // --------------------------------
  // Statistics
  // --------------------------------

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

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="text-sm font-medium text-slate-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // --------------------------------
  // Dashboard
  // --------------------------------

  return (
    <MainLayout>
      <div className="w-full min-w-0 space-y-7">

        {/* Header */}
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
                Dashboard
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Continue your interview preparation and improve your performance.
              </p>
            </div>

            <Button
              className="shrink-0"
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

        {/* Statistics */}
        <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="min-w-0 border-slate-200 p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-2 truncate text-3xl font-bold tracking-tight text-slate-900">
                      {item.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                </div>
              </Card>
            );
          })}

        </section>

        {/* Performance + Start Interview */}
        <section className="grid min-w-0 gap-5 lg:grid-cols-3">

          {/* Performance */}
          <Card className="min-w-0 border-slate-200 p-6 shadow-sm lg:col-span-2">

            <div className="flex items-start justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <BarChart3
                    size={20}
                    className="text-blue-600"
                  />

                  <h2 className="text-lg font-semibold text-slate-900">
                    Performance Overview
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Your scores from recent completed interviews
                </p>
              </div>

              {completedCount > 0 && (
                <div className="hidden rounded-lg bg-blue-50 px-3 py-2 text-right sm:block">
                  <p className="text-xs text-slate-500">
                    Average
                  </p>

                  <p className="text-lg font-bold text-blue-600">
                    {averageScore}%
                  </p>
                </div>
              )}

            </div>

            {completedInterviews.length === 0 ? (
              <div className="mt-6 flex h-64 flex-col items-center justify-center rounded-xl bg-slate-50 text-center">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                  <BarChart3 size={22} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-600">
                  No performance data yet
                </p>

                <p className="mt-1 max-w-sm text-xs text-slate-400">
                  Complete your first interview to see your performance here.
                </p>

              </div>
            ) : (
              <div className="mt-6">

                <div className="flex h-64 min-w-0 items-end gap-3 overflow-hidden rounded-xl bg-slate-50 px-4 py-5 sm:gap-5 sm:px-6">

                  {completedInterviews
                    .slice(0, 8)
                    .reverse()
                    .map((interview, index) => {
                      const score =
                        interview.overallScore || 0;

                      return (
                        <div
                          key={interview._id}
                          className="flex min-w-0 flex-1 flex-col items-center justify-end"
                        >

                          <div
                            className="w-full max-w-[55px] rounded-t-lg bg-blue-500 transition-all hover:bg-blue-600"
                            style={{
                              height: `${Math.max(
                                score * 2,
                                8
                              )}px`,
                            }}
                            title={`${score}%`}
                          />

                          <p className="mt-2 text-xs font-semibold text-slate-600">
                            {score}%
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            #{index + 1}
                          </p>

                        </div>
                      );
                    })}

                </div>

              </div>
            )}

          </Card>

          {/* Start Interview */}
          <Card className="flex min-w-0 flex-col border-slate-200 p-6 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Target size={21} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Start a New Interview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Practice with an AI interviewer and receive detailed feedback on your performance.
            </p>

            <div className="mt-auto pt-6">
              <Button
                className="w-full"
                onClick={() => navigate("/interview")}
              >
                Start Interview

                <ArrowRight
                  className="ml-2"
                  size={17}
                />
              </Button>
            </div>

          </Card>

        </section>

        {/* Recent Interviews */}
        <section className="min-w-0">

          <Card className="min-w-0 overflow-hidden border-slate-200 p-6 shadow-sm">

            <div className="flex items-center justify-between gap-4">

              <div>
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
                  className="shrink-0 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  View all
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
                  Start your first mock interview to begin practicing.
                </p>

                <Button
                  className="mt-5"
                  onClick={() => navigate("/interview")}
                >
                  Start Your First Interview
                </Button>

              </div>
            ) : (
              <div className="mt-6 w-full min-w-0 overflow-x-auto">

                <table className="w-full min-w-[650px] text-left">

                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">

                      <th className="pb-3">
                        Role
                      </th>

                      <th className="pb-3">
                        Type
                      </th>

                      <th className="pb-3">
                        Status
                      </th>

                      <th className="pb-3">
                        Score
                      </th>

                      <th className="pb-3">
                        Date
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

                          <td className="py-4 font-medium text-slate-900">
                            {interview.role}
                          </td>

                          <td className="py-4 text-sm text-slate-500">
                            {interview.interviewType}
                          </td>

                          <td className="py-4 text-sm">

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

                          <td className="py-4 text-sm font-semibold text-slate-700">
                            {interview.status ===
                            "completed"
                              ? `${interview.overallScore || 0}%`
                              : "--"}
                          </td>

                          <td className="py-4 text-sm text-slate-500">
                            {new Date(
                              interview.createdAt
                            ).toLocaleDateString()}
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