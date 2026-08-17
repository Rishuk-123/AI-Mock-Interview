import { useLocation, useNavigate, useParams } from "react"
import {
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Award,
  BarChart2,
  RotateCcw,
  MessageSquare,
} from "lucide-react"
import MainLayout from "../layouts/MainLayout"
import useInterviewStore from "../store/useInterviewStore"

export default function InterviewResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const getInterviewById = useInterviewStore((state) => state.getInterviewById)

  // 1. First try loading from location state, 2. Fallback to store by URL id
  const savedSession = getInterviewById(id)

  const answers = location.state?.answers || savedSession?.answers || []
  const questions = location.state?.questions || savedSession?.questions || []
  const setupConfig = location.state?.setupConfig || {
    role: savedSession?.role || "Frontend Developer",
    company: savedSession?.company || "Tech Practice",
    difficulty: savedSession?.difficulty || "Medium",
  }

  const role = setupConfig.role || "Frontend Developer"
  const company = setupConfig.company || "Tech Practice"
  const difficulty = setupConfig.difficulty || "Medium"

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-7 lg:px-8">
          {/* HEADER CARD */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600">
                      Completed
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      ID: #{id || "1"}
                    </span>
                  </div>
                  <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
                    Interview Feedback & Results
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {role} • {company} ({difficulty})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/interview")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <RotateCcw size={15} /> Retake Interview
              </button>
            </div>

            {/* PERFORMANCE OVERVIEW STATS */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Award size={16} className="text-blue-600" /> Overall Score
                </div>
                <p className="mt-2 text-2xl font-extrabold text-blue-600">
                  85 / 100
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Strong technical clarity
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <MessageSquare size={16} className="text-emerald-600" />{" "}
                  Questions Answered
                </div>
                <p className="mt-2 text-2xl font-extrabold text-emerald-600">
                  {answers.filter((a) => a && a.trim()).length} /{" "}
                  {questions.length || 5}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Completion rate 100%
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <BarChart2 size={16} className="text-indigo-600" />{" "}
                  Assessment Level
                </div>
                <p className="mt-2 text-2xl font-extrabold text-indigo-600">
                  Proficient
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Ready for live interview
                </p>
              </div>
            </div>
          </div>

          {/* DETAILED QUESTION & ANSWER BREAKDOWN */}
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              Detailed Question Responses
            </h2>

            {questions.length > 0 ? (
              questions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-600">
                      Q{idx + 1}
                    </span>
                    <p className="flex-1 text-sm font-bold text-slate-900 leading-snug">
                      {q}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Your Answer:
                    </span>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-slate-700">
                      {answers[idx] && answers[idx].trim() ? (
                        answers[idx]
                      ) : (
                        <span className="italic text-slate-400">
                          No response recorded for this question.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                <Sparkles size={28} className="mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-semibold">
                  No interview details found. Please start a new session.
                </p>
              </div>
            )}
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Return to Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/history")}
              className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
            >
              View Interview History
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}