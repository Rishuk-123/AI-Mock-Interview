import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Briefcase,
  Building2,
  Brain,
  Gauge,
  CheckCircle2,
  ArrowRight,
  FileText,
  Loader2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [useResume, setUseResume] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = useAuthStore((state) => state.token) || localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const targetRole = role.trim() || "Software Developer";
    const interviewId = Date.now().toString();

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${baseUrl}/api/interviews/generate-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          role: targetRole,
          difficulty,
          type,
          company,
          useResume,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        navigate(`/interview/${interviewId}`, {
          state: {
            questions: data.questions,
            setupConfig: { role: targetRole, company, type, difficulty },
          },
        });
      } else {
        // Safe fallback if API returns non-200 or unexpected structure
        const fallbackQuestions = [
          `Can you explain your background and core technical skills as a ${targetRole}?`,
          `Describe a challenging technical obstacle you recently solved in your ${targetRole} projects.`,
          `How do you handle debugging, optimization, and edge-case errors in production?`,
          `What processes do you follow to ensure code quality, testability, and architectural maintainability?`,
        ];

        navigate(`/interview/${interviewId}`, {
          state: {
            questions: fallbackQuestions,
            setupConfig: { role: targetRole, company, type, difficulty },
          },
        });
      }
    } catch (err) {
      console.error("Question generation fallback activated:", err);
      const fallbackQuestions = [
        `Can you explain your background and core technical skills as a ${targetRole}?`,
        `Describe a challenging technical obstacle you recently solved in your ${targetRole} projects.`,
        `How do you handle debugging, optimization, and edge-case errors in production?`,
        `What processes do you follow to ensure code quality, testability, and architectural maintainability?`,
      ];

      navigate(`/interview/${interviewId}`, {
        state: {
          questions: fallbackQuestions,
          setupConfig: { role: targetRole, company, type, difficulty },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-7 lg:px-8">
          
          {/* MAIN CARD CONTAINER */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            
            {/* HEADER SECTION */}
            <div className="border-b border-slate-100 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Interview Details
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Select the type of interview you want to practice.
                  </p>
                </div>
              </div>
            </div>

            {/* ERROR NOTIFICATION */}
            {error && (
              <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600 sm:mx-8">
                {error}
              </div>
            )}

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              
              {/* ROW 1: JOB ROLE & COMPANY */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* JOB ROLE */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                    <Briefcase size={16} className="text-blue-600" />
                    Job Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    The role you are preparing for.
                  </p>
                </div>

                {/* COMPANY */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                    <Building2 size={16} className="text-blue-600" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Amazon"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Optional — helps personalize the interview.
                  </p>
                </div>
              </div>

              {/* INTERVIEW SETTINGS SUBSECTION */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Interview Settings
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* INTERVIEW TYPE */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                      <Brain size={16} className="text-blue-600" />
                      Interview Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Behavioral">Behavioral / HR</option>
                      <option value="System Design">System Design</option>
                    </select>
                  </div>

                  {/* DIFFICULTY */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                      <Gauge size={16} className="text-blue-600" />
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* TAILOR TO RESUME */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Tailor to Uploaded Resume
                    </p>
                    <p className="text-xs text-slate-500">
                      AI will parse your resume skills to generate relevant questions.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={useResume}
                  onChange={(e) => setUseResume(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* FOOTER: WHAT YOU CAN EXPECT */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  What you can expect
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Relevant Questions
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                        Questions based on your selected job role & stack.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        AI Evaluation
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                        Receive instant AI feedback on your answers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Performance Score
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                        Track your interview score and progress over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-60 active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Generating {difficulty} Questions...
                    </>
                  ) : (
                    <>
                      Start Practice Session <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}