import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  ArrowLeft,
  Award,
  BarChart2,
  RotateCcw,
  MessageSquare,
  Sparkles,
  Target,
  Loader2,
  TrendingUp,
  Activity,
  Check,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useInterviewStore from "../store/useInterviewStore";

export default function InterviewResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const getInterviewById = useInterviewStore((state) => state.getInterviewById);
  const savedSession = typeof getInterviewById === "function" && id ? getInterviewById(id) : null;

  const answers = location.state?.answers || savedSession?.answers || [];
  const questions = location.state?.questions || savedSession?.questions || [];
  const setupConfig = location.state?.setupConfig || savedSession?.setupConfig || {
    role: "Software Developer",
    difficulty: "Medium",
  };

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runEvaluation = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://ai-mock-interview-kn7p.onrender.com/api/interview/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions,
            answers,
            role: setupConfig.role,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setEvaluation(data.evaluation);
        }
      } catch (error) {
        console.error("Evaluation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (questions.length > 0) {
      runEvaluation();
    } else {
      setLoading(false);
    }
  }, [questions, answers, setupConfig.role]);

  const score = evaluation?.score ?? 0;
  const focusAreas = evaluation?.focusAreas || ["Provide more detail in your answers", "Focus on technical depth"];

  // Helper logic to calculate progress status
  const getProgressStatus = (scoreValue) => {
    if (scoreValue >= 75) return { label: "High Proficiency", color: "bg-emerald-500", text: "text-emerald-600", bgLight: "bg-emerald-50", border: "border-emerald-200" };
    if (scoreValue >= 40) return { label: "Medium Proficiency", color: "bg-amber-500", text: "text-amber-600", bgLight: "bg-amber-50", border: "border-amber-200" };
    return { label: "Low Proficiency", color: "bg-red-500", text: "text-red-600", bgLight: "bg-red-50", border: "border-red-200" };
  };

  const status = getProgressStatus(score);
  const validAnswersCount = answers.filter((a) => a && a.trim().length > 3).length;

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-7 lg:px-8">
          
          {/* HEADER CARD */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Interview Feedback & Results
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {setupConfig.role} ({setupConfig.difficulty})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/interview")}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <RotateCcw size={15} /> Retake
              </button>
            </div>

            {/* STATS OVERVIEW */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Award size={16} className="text-blue-600" /> AI Score
                </div>
                <p className="mt-2 text-2xl font-extrabold text-blue-600">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : `${score} / 100`}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <MessageSquare size={16} className="text-emerald-600" /> Responses
                </div>
                <p className="mt-2 text-2xl font-extrabold text-emerald-600">
                  {answers.filter((a) => a && a.trim()).length} / {questions.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <BarChart2 size={16} className="text-indigo-600" /> Rating
                </div>
                <p className="mt-2 text-2xl font-extrabold text-indigo-600">
                  {loading ? "Analyzing..." : evaluation?.level || "Needs Review"}
                </p>
              </div>
            </div>
          </div>

          {/* PROGRESS GRAPH & STATISTICS CARD */}
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
                <TrendingUp size={20} className="text-blue-600" /> Performance Level & Progress
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.bgLight} ${status.text} ${status.border}`}>
                {loading ? "Calculating..." : status.label}
              </span>
            </div>

            {/* PROGRESS BAR GRAPH */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>0% (Low)</span>
                <span>50% (Medium)</span>
                <span>100% (High)</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-700 ease-out ${status.color}`}
                  style={{ width: `${loading ? 0 : Math.max(score, 5)}%` }}
                />
              </div>
            </div>

            {/* DETAILED STATISTICAL METRICS */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4 text-center">
              <div className="p-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Answer Completeness</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">
                  {questions.length > 0 ? `${Math.round((validAnswersCount / questions.length) * 100)}%` : "0%"}
                </p>
              </div>
              <div className="p-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Quality Assessment</p>
                <p className={`text-lg font-extrabold mt-1 ${status.text}`}>
                  {score < 40 ? "Low" : score < 75 ? "Medium" : "High"}
                </p>
              </div>
              <div className="p-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Meaningful Inputs</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">
                  {validAnswersCount} of {questions.length}
                </p>
              </div>
              <div className="p-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Target Readiness</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">
                  {score >= 70 ? "Ready" : "Practice Needed"}
                </p>
              </div>
            </div>
          </div>

          {/* AI FOCUS AREAS */}
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-700 font-extrabold text-base mb-3">
              <Target size={20} /> What You Should Focus On
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={16} className="animate-spin text-blue-600" /> AI is evaluating your responses...
              </div>
            ) : (
              <ul className="space-y-2">
                {focusAreas.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-800">
                    <span className="text-blue-600 font-bold">•</span> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* QUESTION BREAKDOWN WITH INTERACTIVE AI FEEDBACK */}
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">Detailed Question Responses</h2>
            {questions.map((q, idx) => {
              const feedback = evaluation?.feedback?.[idx];

              return (
                <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  {/* QUESTION HEADER */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-600">
                      Q{idx + 1}
                    </span>
                    <p className="flex-1 text-sm font-bold text-slate-900">{q}</p>
                  </div>

                  {/* USER ANSWER */}
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Your Answer:
                    </span>
                    <p className="mt-1 text-xs font-medium text-slate-700">
                      {answers[idx] && answers[idx].trim() ? (
                        answers[idx]
                      ) : (
                        <span className="italic text-slate-400">No answer provided.</span>
                      )}
                    </p>
                  </div>

                  {/* AI FEEDBACK CARD */}
                  <div className="mt-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 p-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-indigo-700">
                      <Sparkles size={16} className="shrink-0 text-indigo-600" />
                      <span className="text-xs font-extrabold uppercase tracking-wider">
                        AI Feedback
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-indigo-950">
                      {loading ? (
                        <span className="flex items-center gap-2 text-slate-500">
                          <Loader2 size={14} className="animate-spin text-indigo-600" />
                          Analyzing response...
                        </span>
                      ) : feedback ? (
                        feedback
                      ) : (
                        "Answer was unreadable or incomplete. Provide clear, detailed technical examples to improve this score."
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft size={16} /> Return to Dashboard
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}