import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Award,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  RefreshCw,
  Sparkles,
  Search,
  Loader2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

export default function InterviewHistory() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email || "anonymous";

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || user?.token;
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        let serverList = [];
        if (token) {
          try {
            const res = await fetch(`${baseUrl}/api/interview/history`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.interviews)) {
              serverList = data.interviews;
            }
          } catch (e) {
            console.warn("Backend fetch failed, using local user sessions:", e);
          }
        }

        // Read only this active account's sessions
        const localKey = `recent_interviews_${userEmail}`;
        const localSaved = JSON.parse(localStorage.getItem(localKey) || "[]");

        const combined = [...localSaved, ...serverList];

        // Deduplicate
        const unique = Array.from(
          new Map(
            combined.map((item) => [
              item.id || item._id || `${item.role}_${item.date}`,
              item,
            ])
          ).values()
        );

        const formatted = unique.map((item) => ({
          id: item.id || item._id || Math.random().toString(),
          role: item.role || item.jobRole || "Software Developer",
          difficulty: item.difficulty || item.level || "Medium",
          date:
            item.date ||
            (item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Today"),
          duration: item.duration || "15 mins",
          score:
            item.score ?? item.overallScore ?? item.evaluation?.score ?? 0,
          totalQuestions: item.totalQuestions || item.questions?.length || 4,
          completedQuestions:
            item.completedQuestions || item.answers?.length || 4,
          verdict:
            item.verdict ||
            (item.score >= 75 ? "Proficient" : "Needs Review"),
          feedback: item.feedback || {
            summary:
              item.evaluation?.summary ||
              "Completed mock interview assessment.",
            strengths: item.evaluation?.strengths || [
              "Clear technical foundation",
            ],
            improvements: item.evaluation?.improvements || [
              "Expand on edge cases",
            ],
            qna: item.qna || [],
          },
        }));

        if (isMounted) {
          setInterviews(formatted);
        }
      } catch (err) {
        console.error("Error loading interview history:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      loadHistory();
    } else {
      setInterviews([]);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [userEmail, user]);

  const filteredList = interviews.filter((item) =>
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* VIEW 1: HISTORY LIST */}
          {!selectedInterview ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Interview History
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Review your past AI mock interviews, detailed scorecards, and feedback.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/start-interview")}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
                >
                  <Sparkles size={16} /> New Interview
                </button>
              </div>

              {/* SEARCH BAR */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by job role or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-xs font-semibold shadow-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* LOADING */}
              {loading && (
                <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <Loader2 size={30} className="animate-spin text-blue-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-500">
                    Loading interview records...
                  </p>
                </div>
              )}

              {/* LIST ITEMS */}
              {!loading && (
                <div className="grid grid-cols-1 gap-4">
                  {filteredList.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Award size={24} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-bold text-slate-900">
                              {interview.role}
                            </h3>
                            <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {interview.difficulty}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} /> {interview.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={13} /> {interview.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2
                                size={13}
                                className="text-emerald-500"
                              />{" "}
                              {interview.completedQuestions}/
                              {interview.totalQuestions} Answered
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0">
                        <div className="text-right sm:text-center">
                          <span className="text-2xl font-black text-blue-600">
                            {interview.score}%
                          </span>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            AI Score
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedInterview(interview)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredList.length === 0 && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-400">
                      No interviews found for this account. Complete a practice interview to see your scorecard here!
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* VIEW 2: DETAILS REPORT */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedInterview(null)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={15} /> Back to History
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/start-interview")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
                >
                  <RefreshCw size={14} /> Retake Interview
                </button>
              </div>

              {/* OVERVIEW SCORE CARD */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6">
                  <div>
                    <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                      {selectedInterview.difficulty}
                    </span>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                      {selectedInterview.role} Evaluation
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Completed on {selectedInterview.date} • Duration{" "}
                      {selectedInterview.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-black text-white shadow-lg shadow-blue-500/25">
                      {selectedInterview.score}%
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedInterview.verdict}
                      </p>
                      <p className="text-xs text-slate-500">
                        Overall Performance Index
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      AI Executive Summary
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-slate-700 leading-relaxed">
                      {selectedInterview.feedback?.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 space-y-3">
                      <h4 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        <CheckCircle2 size={16} /> Key Strengths
                      </h4>
                      <ul className="space-y-2">
                        {selectedInterview.feedback?.strengths?.map(
                          (str, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs font-medium text-slate-700"
                            >
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                              {str}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-5 space-y-3">
                      <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                        <AlertCircle size={16} /> Areas For Improvement
                      </h4>
                      <ul className="space-y-2">
                        {selectedInterview.feedback?.improvements?.map(
                          (imp, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs font-medium text-slate-700"
                            >
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                              {imp}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUESTION BY QUESTION BREAKDOWN */}
              {selectedInterview.feedback?.qna &&
                selectedInterview.feedback.qna.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                      <BarChart2 size={18} className="text-blue-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        Question-by-Question Breakdown
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {selectedInterview.feedback.qna.map((q, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-xs font-bold text-slate-900">
                              <span className="text-blue-600">Q{idx + 1}:</span>{" "}
                              {q.question}
                            </p>
                            <span className="shrink-0 rounded-lg bg-blue-100 px-2.5 py-1 text-[11px] font-black text-blue-800">
                              {q.score || 90} / 100
                            </span>
                          </div>

                          <div className="rounded-xl border border-slate-200/60 bg-white p-3 text-xs text-slate-600">
                            <span className="font-bold text-slate-700">
                              Your Response:{" "}
                            </span>
                            "{q.answer}"
                          </div>

                          <p className="text-[11px] font-semibold text-slate-500">
                            <span className="font-bold text-indigo-600">
                              Feedback:{" "}
                            </span>
                            {q.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}