import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  History,
  Search,
  Briefcase,
  Building2,
  Brain,
  Gauge,
  CalendarDays,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function InterviewHistory() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interviews");

        console.log("Interview history:", response.data);

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

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    if (status === "in-progress") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }

    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  const getStatusText = (status) => {
    if (status === "in-progress") {
      return "In Progress";
    }

    if (status === "completed") {
      return "Completed";
    }

    return "Scheduled";
  };

  const getScoreStyle = (score) => {
    if (score >= 80) {
      return "text-emerald-600";
    }

    if (score >= 60) {
      return "text-blue-600";
    }

    return "text-red-500";
  };

  const filteredInterviews = interviews.filter((interview) => {
    const search = searchTerm.toLowerCase();

    return (
      interview.role?.toLowerCase().includes(search) ||
      interview.company?.toLowerCase().includes(search) ||
      interview.interviewType?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="text-sm font-medium text-slate-600">
                Loading your interview history...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2">
            <History
              size={20}
              className="text-blue-600"
            />

            <span className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              Interview Tracking
            </span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Interview History
              </h1>

              <p className="mt-2 text-lg text-slate-500">
                Review your previous interviews and track your performance.
              </p>
            </div>

            <Button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2"
            >
              Start New Interview
              <ArrowRight size={18} />
            </Button>

          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <Card className="border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Interviews
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {interviews.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <History size={22} />
              </div>

            </div>
          </Card>

          <Card className="border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {
                    interviews.filter(
                      (item) => item.status === "completed"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ClipboardCheck size={22} />
              </div>

            </div>
          </Card>

          <Card className="border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  In Progress
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {
                    interviews.filter(
                      (item) => item.status === "in-progress"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Brain size={22} />
              </div>

            </div>
          </Card>

        </div>

        {/* ================= SEARCH ================= */}
        {interviews.length > 0 && (
          <Card className="mb-6 border-slate-200 p-4 shadow-sm">

            <div className="relative">

              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search by role, company or interview type..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </Card>
        )}

        {/* ================= EMPTY STATE ================= */}
        {interviews.length === 0 ? (

          <Card className="border-slate-200 p-12 shadow-sm">

            <div className="mx-auto max-w-md text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <History size={30} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No interviews yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start your first AI mock interview and your interview
                results will appear here.
              </p>

              <Button
                className="mt-6 inline-flex items-center gap-2"
                onClick={() => navigate("/interview")}
              >
                Start Your First Interview
                <ArrowRight size={18} />
              </Button>

            </div>

          </Card>

        ) : filteredInterviews.length === 0 ? (

          <Card className="border-slate-200 p-10 shadow-sm">

            <div className="text-center">

              <Search
                size={32}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No matching interviews
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try searching with a different role or company.
              </p>

            </div>

          </Card>

        ) : (

          /* ================= INTERVIEW LIST ================= */
          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your Interviews
                </h2>

                <p className="text-sm text-slate-500">
                  {filteredInterviews.length} interview
                  {filteredInterviews.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {filteredInterviews.map((interview) => {

              const score = interview.overallScore || 0;

              return (
                <Card
                  key={interview._id}
                  className="overflow-hidden border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  <div className="p-6">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                      {/* LEFT */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-xl font-bold text-slate-900">
                            {interview.role || "Interview"}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              interview.status
                            )}`}
                          >
                            {getStatusText(interview.status)}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {interview.company ||
                            "Company not specified"}
                        </p>

                        {/* DETAILS */}
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Brain
                              size={16}
                              className="text-blue-600"
                            />

                            <span>
                              {interview.interviewType ||
                                "Not specified"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Gauge
                              size={16}
                              className="text-blue-600"
                            />

                            <span>
                              {interview.difficulty ||
                                "Not specified"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays
                              size={16}
                              className="text-blue-600"
                            />

                            <span>
                              {interview.createdAt
                                ? new Date(
                                    interview.createdAt
                                  ).toLocaleDateString()
                                : "Date unavailable"}
                            </span>
                          </div>

                        </div>

                      </div>

                      {/* RIGHT */}
                      <div className="flex shrink-0 items-center justify-between gap-8 border-t border-slate-100 pt-5 lg:border-t-0 lg:pt-0">

                        {/* SCORE */}
                        <div className="text-center">

                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Score
                          </p>

                          <p
                            className={`mt-1 text-3xl font-bold ${getScoreStyle(
                              score
                            )}`}
                          >
                            {interview.status === "completed"
                              ? score
                              : "--"}
                          </p>

                          {interview.status === "completed" && (
                            <p className="text-xs text-slate-400">
                              out of 100
                            </p>
                          )}

                        </div>

                        {/* BUTTON */}
                        <Button
                          className="flex items-center gap-2"
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
                          {interview.status ===
                          "completed"
                            ? "View Results"
                            : "Continue"}

                          <ArrowRight size={17} />
                        </Button>

                      </div>

                    </div>

                  </div>

                </Card>
              );
            })}

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default InterviewHistory;