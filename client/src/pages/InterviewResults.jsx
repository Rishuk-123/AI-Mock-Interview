import { useEffect, useState, useRef } from "react";
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
  Download,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useInterviewStore from "../store/useInterviewStore";

export default function InterviewResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const savedToStorageRef = useRef(false);

  const getInterviewById = useInterviewStore((state) => state.getInterviewById);
  const savedSession = typeof getInterviewById === "function" && id ? getInterviewById(id) : null;

  // Read data passed from History navigation or Zustand state
  const answers = location.state?.answers || savedSession?.answers || [];
  const questions = location.state?.questions || savedSession?.questions || [];
  const setupConfig = location.state?.setupConfig || savedSession?.setupConfig || {
    role: "Software Developer",
    difficulty: "Medium",
  };

  // Preload state if evaluation was already passed from History
  const preloadedEvaluation = location.state?.evaluation || savedSession?.evaluation || null;
  const [evaluation, setEvaluation] = useState(preloadedEvaluation);
  const [loading, setLoading] = useState(!preloadedEvaluation);

  // Local calculation helper for immediate fallback rendering
  const generateLocalFallbackScore = (questionsList, answersList) => {
    const validAnswers = answersList.filter((a) => a && typeof a === "string" && a.trim().length > 10);
    const ratio = questionsList.length > 0 ? validAnswers.length / questionsList.length : 0;
    const estimatedScore = Math.round(ratio * 85);

    return {
      score: estimatedScore,
      level: estimatedScore >= 70 ? "Proficient" : estimatedScore >= 40 ? "Intermediate" : "Needs Improvement",
      focusAreas: [
        "Elaborate further with specific production examples and tools.",
        "Include metrics or quantifiable outcomes in your explanations.",
      ],
      feedback: answersList.map((ans) =>
        ans && typeof ans === "string" && ans.trim().length > 10
          ? "Good concise answer provided. Consider expanding on real-world application or edge cases."
          : "Answer was too brief or empty. Provide clear technical explanations."
      ),
    };
  };

  useEffect(() => {
    if (preloadedEvaluation) {
      setEvaluation(preloadedEvaluation);
      setLoading(false);
      return;
    }

    const runEvaluation = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const response = await fetch(`${baseUrl}/api/interviews/evaluate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions,
            answers,
            role: setupConfig.role,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.evaluation) {
          setEvaluation(data.evaluation);
        } else {
          console.warn("API returned non-200 evaluation, using fallback:", data);
          setEvaluation(generateLocalFallbackScore(questions, answers));
        }
      } catch (error) {
        console.error("Evaluation request error:", error);
        setEvaluation(generateLocalFallbackScore(questions, answers));
      } finally {
        setLoading(false);
      }
    };

    if (questions && questions.length > 0) {
      runEvaluation();
    } else {
      setLoading(false);
    }
  }, [preloadedEvaluation, questions, answers, setupConfig.role]);

  // Persist session to localStorage so it appears in Interview History
  useEffect(() => {
    if (loading || !evaluation || savedToStorageRef.current) return;
    savedToStorageRef.current = true;

    const sessionEntry = {
      id: id || `interview_${Date.now()}`,
      role: setupConfig.role || "Software Developer",
      difficulty: setupConfig.difficulty || "Medium",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      duration: "15 mins",
      score: evaluation.score ?? 80,
      totalQuestions: questions.length || 4,
      completedQuestions: answers.filter((a) => a && typeof a === "string" && a.trim()).length || 4,
      verdict: evaluation.level || (evaluation.score >= 75 ? "Proficient" : "Needs Review"),
      evaluation,
      questions,
      answers,
      feedback: {
        summary: `Completed ${setupConfig.role} mock interview assessment.`,
        strengths: [
          "Clear explanation of primary technical concepts.",
          "Demonstrated structured logical reasoning across interview prompts.",
        ],
        improvements: evaluation.focusAreas || [
          "Elaborate further with specific production metrics.",
          "Include error-handling edge cases in code architecture.",
        ],
        qna: questions.map((q, idx) => ({
          question: typeof q === "string" ? q : q.question || "Question",
          answer: answers[idx] || "Candidate response submitted.",
          score: Math.round(evaluation.score ?? 80),
          feedback: evaluation.feedback?.[idx] || "Solid response provided.",
        })),
      },
    };

    const existing = JSON.parse(localStorage.getItem("recent_interviews") || "[]");
    const filtered = existing.filter((item) => item.id !== sessionEntry.id);
    localStorage.setItem("recent_interviews", JSON.stringify([sessionEntry, ...filtered]));
  }, [loading, evaluation, id, setupConfig, questions, answers]);

  const score = evaluation?.score ?? 0;
  const focusAreas = evaluation?.focusAreas || ["Provide more detail in your answers", "Focus on technical depth"];

  const getProgressStatus = (scoreValue) => {
    if (scoreValue >= 75) return { label: "High Proficiency", color: "bg-emerald-500", text: "text-emerald-600", bgLight: "bg-emerald-50", border: "border-emerald-200" };
    if (scoreValue >= 40) return { label: "Medium Proficiency", color: "bg-amber-500", text: "text-amber-600", bgLight: "bg-amber-50", border: "border-amber-200" };
    return { label: "Low Proficiency", color: "bg-red-500", text: "text-red-600", bgLight: "bg-red-50", border: "border-red-200" };
  };

  const status = getProgressStatus(score);
  const validAnswersCount = answers.filter((a) => a && typeof a === "string" && a.trim().length > 3).length;

  // Isolated Report PDF Download Handler
  const handleDownloadPDF = () => {
    const reportElement = document.getElementById("interview-report-content");
    if (!reportElement) return;

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "none";
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow.document;

    // Collect all loaded styling stylesheets
    const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
      .map((el) => el.outerHTML)
      .join("");

    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${setupConfig.role}_Interview_Feedback</title>
          ${styles}
          <style>
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              padding: 24px !important;
              font-family: Inter, system-ui, -apple-system, sans-serif !important;
            }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: 0 auto;">
            ${reportElement.innerHTML}
          </div>
        </body>
      </html>
    `);

    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 400);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-7 lg:px-8">
          
          {/* ISOLATED REPORT WRAPPER */}
          <div id="interview-report-content" className="space-y-6">
            
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

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3 no-print">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                  >
                    <Download size={15} /> Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/start-interview")}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    <RotateCcw size={15} /> Retake
                  </button>
                </div>
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
                    {answers.filter((a) => a && typeof a === "string" && a.trim()).length} / {questions.length}
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
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
                  <TrendingUp size={20} className="text-blue-600" /> Performance Level & Progress
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.bgLight} ${status.text} ${status.border}`}>
                  {loading ? "Calculating..." : status.label}
                </span>
              </div>

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
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm">
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

            {/* QUESTION BREAKDOWN */}
            <div className="space-y-6">
              <h2 className="text-lg font-extrabold text-slate-900">Detailed Question Responses</h2>
              {questions.map((q, idx) => {
                const questionText = typeof q === "string" ? q : q.question || q;
                const answerText = answers[idx] || (typeof q === "object" ? q.answer : "");
                const feedback = evaluation?.feedback?.[idx];

                return (
                  <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-600">
                        Q{idx + 1}
                      </span>
                      <p className="flex-1 text-sm font-bold text-slate-900">{questionText}</p>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Your Answer:
                      </span>
                      <p className="mt-1 text-xs font-medium text-slate-700">
                        {answerText && typeof answerText === "string" && answerText.trim() ? (
                          answerText
                        ) : (
                          <span className="italic text-slate-400">No answer provided.</span>
                        )}
                      </p>
                    </div>

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
                          "Provide detailed technical explanations and clear project examples to increase your overall score."
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* BOTTOM ACTIONS */}
          <div className="mt-8 flex items-center justify-between gap-4 no-print">
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft size={16} /> Return to History
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}