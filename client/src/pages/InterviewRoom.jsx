import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Mic,
  MicOff,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useInterviewStore from "../store/useInterviewStore";

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
  const saveInterview = useInterviewStore((state) => state.saveInterview);

  const setupConfig = location.state || {
    role: "Frontend Developer",
    company: "Tech Corp",
    type: "Technical",
    difficulty: "Medium",
  };

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);

  const recognitionRef = useRef(null);
  const baseTextRef = useRef("");

  useEffect(() => {
    setLoading(true);
    const roleLower = setupConfig.role?.toLowerCase() || "";
    let selectedBank = QUESTION_BANKS.default;

    if (
      roleLower.includes("backend") ||
      roleLower.includes("node") ||
      roleLower.includes("java")
    ) {
      selectedBank = QUESTION_BANKS.backend;
    } else if (
      roleLower.includes("frontend") ||
      roleLower.includes("react") ||
      roleLower.includes("web")
    ) {
      selectedBank = QUESTION_BANKS.frontend;
    }

    setQuestions(selectedBank);
    setAnswers(Array(selectedBank.length).fill(""));
    setLoading(false);
  }, [setupConfig]);

  useEffect(() => {
    const val = answers[currentIndex] || "";
    setCurrentAnswer(val);
    baseTextRef.current = val;
  }, [currentIndex]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let speechTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        speechTranscript += event.results[i][0].transcript;
      }

      const base = baseTextRef.current.trim();
      const fullText = base
        ? `${base} ${speechTranscript.trim()}`
        : speechTranscript.trim();

      setCurrentAnswer(fullText);

      setAnswers((prev) => {
        const copy = [...prev];
        copy[currentIndex] = fullText;
        return copy;
      });
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [currentIndex]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      baseTextRef.current = currentAnswer;
    } else {
      try {
        baseTextRef.current = currentAnswer;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Mic start error:", e);
      }
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setCurrentAnswer(val);
    baseTextRef.current = val;

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = val;
      return updated;
    });
  };

  const handleNext = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = currentAnswer;
    setAnswers(updatedAnswers);

    const targetId = id || Date.now().toString();

    if (currentIndex === questions.length - 1) {
      // Save session into store & localStorage
      const savedSession = saveInterview({
        id: targetId,
        setupConfig,
        questions,
        answers: updatedAnswers,
      });

      navigate(`/interview/${savedSession.id}/results`, {
        state: { answers: updatedAnswers, setupConfig, questions },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentIndex] = currentAnswer;
      setAnswers(updatedAnswers);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  const currentQuestion = questions[currentIndex] || "";
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-7 lg:px-8">
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
                {setupConfig.role} Session
              </h1>
            </div>

            <button
              type="button"
              onClick={() => navigate("/history")}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
            >
              End Interview
            </button>
          </div>

          {/* MAIN GRID */}
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
                      {setupConfig.company} • {setupConfig.difficulty}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-base font-semibold leading-relaxed text-slate-800">
                    "{currentQuestion}"
                  </p>
                </div>
              </div>
            </div>

            {/* CANDIDATE RESPONSE BOX */}
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
                      {isListening ? "Listening... Speak now" : "Type or speak your answer"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleMic}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition ${
                    isListening
                      ? "animate-pulse border-red-300 bg-red-50 text-red-600"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                  title={isListening ? "Stop Microphone" : "Start Microphone"}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>

              <textarea
                value={currentAnswer}
                onChange={handleTextChange}
                placeholder="Type your response here or click the microphone icon to speak..."
                className="mt-4 flex-1 min-h-[180px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrevious}
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