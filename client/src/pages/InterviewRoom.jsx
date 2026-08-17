import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Mic,
  MicOff,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";

// Question bank mapped by domain/role category
const QUESTION_BANKS = {
  frontend: [
    "Can you explain the Virtual DOM in React and how it optimizes UI updates?",
    "What is the difference between state and props in React?",
    "How do React hooks like useEffect work, and how do you handle cleanup?",
    "Explain the concept of closures in JavaScript with a practical example.",
    "How would you optimize the performance of a large-scale React application?",
  ],
  backend: [
    "How do indexing and query execution plans work in relational databases?",
    "Explain the difference between synchronous and asynchronous I/O in Node.js or Python.",
    "How do you design a secure authentication system using JWTs and refresh tokens?",
    "What are ACID properties in databases, and how do NOSQL databases handle consistency?",
    "How do you handle rate limiting and caching with Redis in a backend service?",
  ],
  system_design: [
    "How would you design a scalable URL shortener like Bitly?",
    "Explain horizontal scaling vs. vertical scaling and load balancing strategies.",
    "How does a Distributed Message Queue like Kafka or RabbitMQ work under heavy load?",
    "What strategies would you use to handle database sharding and replication?",
    "How do CDNs work, and how do you optimize global static asset delivery?",
  ],
  default: [
    "Tell me about a challenging technical project you worked on recently.",
    "How do you approach debugging a high-priority bug in production?",
    "Explain how you prioritize technical debt versus building new features.",
    "How do you ensure code quality and write effective unit tests?",
    "Describe a time you had to make an architectural tradeoff under tight deadlines.",
  ],
};

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Extract setup configuration passed from InterviewSetup.jsx (or default)
  const setupConfig = location.state || {
    role: "Frontend Developer",
    company: "Tech Corp",
    type: "Technical",
    difficulty: "Medium",
  };

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamically load questions based on Role / Type / Difficulty
  useEffect(() => {
    setLoading(true);

    const roleLower = setupConfig.role?.toLowerCase() || "";
    const typeLower = setupConfig.type?.toLowerCase() || "";

    let selectedBank = QUESTION_BANKS.default;

    if (typeLower.includes("system") || roleLower.includes("system")) {
      selectedBank = QUESTION_BANKS.system_design;
    } else if (roleLower.includes("backend") || roleLower.includes("node") || roleLower.includes("java")) {
      selectedBank = QUESTION_BANKS.backend;
    } else if (roleLower.includes("frontend") || roleLower.includes("react") || roleLower.includes("web")) {
      selectedBank = QUESTION_BANKS.frontend;
    }

    setQuestions(selectedBank);
    setAnswers(Array(selectedBank.length).fill(""));
    setLoading(false);
  }, [setupConfig]);

  const currentQuestion = questions[currentIndex] || "";
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerChange = (e) => {
    const updated = [...answers];
    updated[currentIndex] = e.target.value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      navigate(`/interview/${id || "1"}/results`, {
        state: { answers, setupConfig, questions },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleEndEarly = () => {
    if (confirm("Are you sure you want to exit? Your progress will be saved.")) {
      navigate(`/interview/${id || "1"}/results`, {
        state: { answers, setupConfig, questions },
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <p className="text-sm font-semibold">Generating questions for {setupConfig.role}...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-7 lg:px-8">
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {setupConfig.company}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {setupConfig.difficulty}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
                {setupConfig.role} Session
              </h1>
            </div>

            <button
              type="button"
              onClick={handleEndEarly}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
            >
              End Interview
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* QUESTION & RESPONSE GRID */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* AI QUESTION BOX */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      AI Interviewer
                    </h3>
                    <p className="text-xs text-slate-500">
                      Targeted for {setupConfig.role}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-base font-semibold leading-relaxed text-slate-800">
                    "{currentQuestion}"
                  </p>
                </div>
              </div>

              {/* STEP DOTS */}
              <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-4">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? "w-8 bg-blue-600"
                        : answers[idx]?.trim()
                        ? "w-2.5 bg-emerald-500"
                        : "w-2.5 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* RESPONSE BOX */}
            <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Your Answer
                    </h3>
                    <p className="text-xs text-slate-500">
                      Type or speak your answer
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                    isMuted
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>

              <textarea
                value={answers[currentIndex] || ""}
                onChange={handleAnswerChange}
                placeholder="Type your response here or speak using your microphone..."
                className="mt-4 flex-1 min-h-[180px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
                >
                  {isLastQuestion ? (
                    <>
                      Submit Interview <CheckCircle2 size={16} />
                    </>
                  ) : (
                    <>
                      Next Question <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}