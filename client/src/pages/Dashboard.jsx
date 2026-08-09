import { useEffect, useState } from "react";
import {
  Video,
  Clock,
  Trophy,
  TrendingUp,
  ArrowRight,
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

        setInterviews(
          response.data.interviews || []
        );
      } catch (error) {
        console.error(
          "Dashboard interviews error:",
          error
        );

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

  // -----------------------------
  // Calculate statistics
  // -----------------------------

  const completedInterviews = interviews.filter(
    (interview) =>
      interview.status === "completed"
  );

  const totalInterviews = interviews.length;

  const completedCount =
    completedInterviews.length;

  const averageScore =
    completedCount > 0
      ? Math.round(
          completedInterviews.reduce(
            (sum, interview) =>
              sum +
              (interview.overallScore || 0),
            0
          ) / completedCount
        )
      : 0;

  const bestScore =
    completedCount > 0
      ? Math.max(
          ...completedInterviews.map(
            (interview) =>
              interview.overallScore || 0
          )
        )
      : 0;

  // Calculate total duration in minutes
  const totalMinutes = interviews.reduce(
    (sum, interview) =>
      sum + (interview.duration || 0),
    0
  );

  const practiceHours = (
    totalMinutes / 60
  ).toFixed(1);

  // -----------------------------
  // Statistics cards
  // -----------------------------

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

  // -----------------------------
  // Loading state
  // -----------------------------

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-600">
            Loading dashboard...
          </p>
        </div>
      </MainLayout>
    );
  }

  // -----------------------------
  // Dashboard
  // -----------------------------

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-slate-500">
            Continue your interview preparation
            and improve your performance.
          </p>
        </section>

        {/* Statistics */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="p-5"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {item.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                </div>
              </Card>
            );
          })}

        </section>

        {/* Performance + Start Interview */}
        <section className="grid gap-6 lg:grid-cols-3">

          {/* Performance */}
          <Card className="p-6 lg:col-span-2">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Performance Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your scores from recent completed
                interviews
              </p>
            </div>

            {completedInterviews.length === 0 ? (
              <div className="mt-8 flex h-64 items-center justify-center rounded-lg bg-slate-50">
                <p className="text-sm text-slate-400">
                  Complete an interview to see
                  your performance.
                </p>
              </div>
            ) : (
              <div className="mt-8 flex h-64 items-end gap-4 overflow-x-auto rounded-lg bg-slate-50 p-6">

                {completedInterviews
                  .slice(0, 8)
                  .reverse()
                  .map((interview, index) => {
                    const score =
                      interview.overallScore || 0;

                    return (
                      <div
                        key={interview._id}
                        className="flex min-w-[50px] flex-1 flex-col items-center justify-end"
                      >

                        <div
                          className="w-full max-w-[55px] rounded-t-lg bg-blue-500 transition-all"
                          style={{
                            height: `${Math.max(
                              score * 2,
                              8
                            )}px`,
                          }}
                          title={`${score}%`}
                        />

                        <p className="mt-2 text-xs font-medium text-slate-600">
                          {score}%
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          #{index + 1}
                        </p>

                      </div>
                    );
                  })}

              </div>
            )}

          </Card>

          {/* Start Interview */}
          <Card className="p-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Start a New Interview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Practice with an AI interviewer and
              receive detailed feedback on your
              performance.
            </p>

            <Button
              className="mt-6 w-full"
              onClick={() =>
                navigate("/interview")
              }
            >
              Start Interview

              <ArrowRight
                className="ml-2"
                size={17}
              />
            </Button>

          </Card>

        </section>

        {/* Recent Interviews */}
        <section>

          <Card className="p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Interviews
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest interview sessions
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/history")
                }
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all
              </button>

            </div>

            {interviews.length === 0 ? (
              <div className="mt-6 rounded-lg bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">
                  You haven't created any
                  interviews yet.
                </p>

                <Button
                  className="mt-4"
                  onClick={() =>
                    navigate("/interview")
                  }
                >
                  Start Your First Interview
                </Button>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">

                <table className="w-full text-left">

                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                      <th className="pb-3 font-medium">
                        Role
                      </th>

                      <th className="pb-3 font-medium">
                        Type
                      </th>

                      <th className="pb-3 font-medium">
                        Status
                      </th>

                      <th className="pb-3 font-medium">
                        Score
                      </th>

                      <th className="pb-3 font-medium">
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
                          className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
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
                              className={
                                interview.status ===
                                "completed"
                                  ? "font-medium text-green-600"
                                  : interview.status ===
                                    "in-progress"
                                  ? "font-medium text-blue-600"
                                  : "font-medium text-yellow-600"
                              }
                            >
                              {interview.status}
                            </span>
                          </td>

                          <td className="py-4 text-sm font-medium text-slate-700">
                            {interview.status ===
                            "completed"
                              ? `${interview.overallScore}%`
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