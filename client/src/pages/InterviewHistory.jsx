import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  History,
  Video,
  CheckCircle2,
  Clock3,
  Trophy,
  CalendarDays,
  Brain,
  Gauge,
  Building2,
  ArrowRight,
  Play,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function InterviewHistory() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");

        setInterviews(response.data.interviews || []);
      } catch (error) {
        console.error("Interview history error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load interview history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const statistics = useMemo(() => {
    const total = interviews.length;

    const completed = interviews.filter(
      (interview) => interview.status === "completed"
    ).length;

    const inProgress = interviews.filter(
      (interview) => interview.status === "in-progress"
    ).length;

    const completedInterviews = interviews.filter(
      (interview) => interview.status === "completed"
    );

    const averageScore =
      completedInterviews.length > 0
        ? Math.round(
            completedInterviews.reduce(
              (sum, interview) =>
                sum + (interview.overallScore || 0),
              0
            ) / completedInterviews.length
          )
        : 0;

    return {
      total,
      completed,
      inProgress,
      averageScore,
    };
  }, [interviews]);

  const getStatusConfig = (status) => {
    if (status === "completed") {
      return {
        label: "Completed",
        className:
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
      };
    }

    if (status === "in-progress") {
      return {
        label: "In Progress",
        className:
          "bg-blue-500/10 text-blue-400 border-blue-500/20",
        icon: Clock3,
      };
    }

    return {
      label: "Scheduled",
      className:
        "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: Clock3,
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-emerald-400";
    }

    if (score >= 60) {
      return "text-blue-400";
    }

    return "text-red-400";
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleInterviewAction = (interview) => {
    if (interview.status === "completed") {
      navigate(
        `/interview/${interview._id}/results`
      );
    } else {
      navigate(`/interview/${interview._id}`);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[500px] items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800/50">
              <History size={24} />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-300">
              Loading interview history...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait a moment.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-7xl bg-slate-950 text-white min-h-screen p-6">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <History
                size={21}
                className="text-blue-400"
              />

              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Interview Practice
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Interview History
            </h1>

            <p className="mt-2 text-base text-slate-400">
              Review your previous interviews and track your performance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/interview")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
          >
            <Video size={18} />
            New Interview
            <ArrowRight size={17} />
          </button>

        </div>

        {/* STATISTICS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Interviews
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {statistics.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/50">
                <History size={21} />
              </div>

            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {statistics.completed}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                <CheckCircle2 size={21} />
              </div>

            </div>
          </div>

          {/* In Progress */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {statistics.inProgress}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/50">
                <Clock3 size={21} />
              </div>

            </div>
          </div>

          {/* Average Score */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Average Score
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {statistics.averageScore}%
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/50">
                <Trophy size={21} />
              </div>

            </div>
          </div>

        </div>

        {/* INTERVIEW LIST CONTAINER */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg backdrop-blur">

          {/* List Header */}
          <div className="flex flex-col gap-2 border-b border-slate-800/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-white">
                Recent Interviews
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your latest interview sessions
              </p>
            </div>

            <span className="text-sm font-medium text-slate-400">
              {interviews.length}{" "}
              {interviews.length === 1
                ? "interview"
                : "interviews"}
            </span>

          </div>

          {/* Empty State */}
          {interviews.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-slate-500 border border-slate-800">
                <Video size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                No interviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                Start your first AI mock interview and your results will appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/interview")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
              >
                <Play size={17} />
                Start Interview
              </button>

            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">

              {interviews.map((interview) => {
                const score = interview.overallScore || 0;
                const status = getStatusConfig(interview.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={interview._id}
                    className="p-6 transition hover:bg-slate-800/40"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* Interview Info */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-bold text-white">
                            {interview.role || "Interview"}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            <StatusIcon size={13} />
                            {status.label}
                          </span>

                        </div>

                        {/* Company */}
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                          <Building2 size={16} />

                          <span>
                            {interview.company || "Company not specified"}
                          </span>
                        </div>

                        {/* Details Badges */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">

                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Brain
                              size={16}
                              className="text-blue-400"
                            />

                            <span>
                              {interview.interviewType || "Not specified"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Gauge
                              size={16}
                              className="text-blue-400"
                            />

                            <span>
                              {interview.difficulty || "Not specified"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <CalendarDays
                              size={16}
                              className="text-blue-400"
                            />

                            <span>
                              {formatDate(interview.createdAt)}
                            </span>
                          </div>

                        </div>

                      </div>

                      {/* Score + Action Button */}
                      <div className="flex shrink-0 items-center justify-between gap-8 border-t border-slate-800/80 pt-4 lg:border-0 lg:pt-0">

                        {/* Score */}
                        <div className="min-w-[90px] text-center">

                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Score
                          </p>

                          {interview.status === "completed" ? (
                            <>
                              <p
                                className={`mt-1 text-2xl font-extrabold ${getScoreColor(
                                  score
                                )}`}
                              >
                                {score}
                              </p>

                              <p className="text-xs text-slate-500">
                                out of 100
                              </p>
                            </>
                          ) : (
                            <p className="mt-1 text-2xl font-bold text-slate-600">
                              --
                            </p>
                          )}

                        </div>

                        {/* Action CTA */}
                        <button
                          type="button"
                          onClick={() =>
                            handleInterviewAction(interview)
                          }
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
                        >
                          {interview.status === "completed"
                            ? "View Results"
                            : "Continue"}

                          <ArrowRight size={16} />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}

export default InterviewHistory;