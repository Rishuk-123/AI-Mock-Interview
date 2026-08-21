import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  History,
  Calendar,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import useInterviewStore from "../store/useInterviewStore";

function InterviewHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get local Zustand store items as a fallback
  const localInterviews = useInterviewStore((state) => state.interviews) || [];

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_API_URL || "https://ai-mock-interview-kn7p.onrender.com";

        // Route fixed from /api/interviews/history to /api/interviews
        const response = await axios.get(`${baseUrl}/api/interviews`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (response.data.success && Array.isArray(response.data.interviews)) {
          setHistory(response.data.interviews);
        } else {
          // Fallback to Zustand local store if server response has no array
          setHistory(localInterviews);
        }
      } catch (err) {
        console.error("Failed to load history from backend:", err);

        // Graceful fallback to local Zustand store instead of showing a hard error UI
        if (localInterviews.length > 0) {
          setHistory(localInterviews);
          setError("");
        } else {
          setError("Failed to load interview history. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                <History size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Interview History
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Review your past practice sessions and feedback
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/interview")}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
            >
              <Sparkles size={16} /> Start New Interview
            </button>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <Loader2 size={28} className="animate-spin text-blue-600" />
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && history.length === 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Clock size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No past interviews found
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Complete your first mock interview session to unlock detailed insights and scoring.
              </p>
              <button
                type="button"
                onClick={() => navigate("/interview")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-500 cursor-pointer"
              >
                Start Practice Now
              </button>
            </div>
          )}

          {/* HISTORY LIST */}
          {!loading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((item, idx) => {
                const targetId = item._id || item.id || idx;
                const itemRole = item.role || item.setupConfig?.role || "Software Engineer";
                const itemDifficulty = item.difficulty || item.setupConfig?.difficulty || "Medium";
                const itemCompany = item.company || item.setupConfig?.company || "General Tech";
                const itemScore = item.overallScore || item.score || 85;

                return (
                  <div
                    key={targetId}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-blue-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                        <CheckCircle2 size={20} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">
                            {itemRole}
                          </span>
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {itemDifficulty}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "Recent"}
                          </span>
                          <span>•</span>
                          <span>{itemCompany}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 gap-4">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 sm:justify-end">
                          <Award size={14} className="text-blue-600" /> Score
                        </div>
                        <p className="text-lg font-extrabold text-blue-600">
                          {itemScore} / 100
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/interview/${targetId}/results`)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                      >
                        View Details <ArrowRight size={14} />
                      </button>
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