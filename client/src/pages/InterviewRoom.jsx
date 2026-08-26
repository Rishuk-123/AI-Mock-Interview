import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Mic,
  MicOff,
  User,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Volume2,
  ArrowLeft,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import useInterviewStore from "../store/useInterviewStore";
import useAuthStore from "../store/authStore";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const saveInterview = useInterviewStore((state) => state.saveInterview);
  const token = useAuthStore((state) => state.token) || localStorage.getItem("token");

  const passedQuestions = useMemo(() => {
    return location.state?.questions || [];
  }, [location.state?.questions]);

  const setupConfig = useMemo(() => {
    return (
      location.state?.setupConfig ||
      location.state || {
        role: "Frontend Developer",
        type: "Technical",
        difficulty: "Medium",
      }
    );
  }, [location.state]);

  const [questions, setQuestions] = useState(passedQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(
    passedQuestions.length > 0 ? Array(passedQuestions.length).fill("") : []
  );
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(passedQuestions.length === 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef(null);
  const baseTextRef = useRef("");

  const currentAnswer = answers[currentIndex] || "";
  const role = setupConfig.role || "Software Developer";
  const difficulty = setupConfig.difficulty || "Medium";
  const type = setupConfig.type || "Technical";

  const speakQuestion = (text) => {
    if (!("speechSynthesis" in window) || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.includes("en"));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Fetch dynamic questions if none were passed
  useEffect(() => {
    if (passedQuestions && passedQuestions.length > 0) {
      return;
    }

    let isMounted = true;

    const fetchDynamicQuestions = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const apiUrl = `${baseUrl}/api/interviews/generate-questions`;

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ role, difficulty, type }),
        });

        const data = await response.json();

        if (isMounted) {
          if (response.ok && data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
            setAnswers(Array(data.questions.length).fill(""));
          } else {
            throw new Error("No questions returned from API");
          }
        }
      } catch (error) {
        console.error("Failed to fetch dynamic questions, using fallback:", error);
        if (isMounted) {
          const fallbackQuestions = [
            `Can you explain your background and core technical skills as a ${role}?`,
            "Describe a challenging technical problem you recently solved in your projects.",
            "How do you handle debugging and optimization in a production environment?",
            "What processes do you follow to ensure your code is maintainable and well-tested?",
          ];
          setQuestions(fallbackQuestions);
          setAnswers(Array(fallbackQuestions.length).fill(""));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDynamicQuestions();

    return () => {
      isMounted = false;
    };
  }, [passedQuestions, role, difficulty, type, token]);

  // Audio side-effects only (no synchronous setState)
  useEffect(() => {
    if (questions.length > 0 && questions[currentIndex]) {
      baseTextRef.current = answers[currentIndex] || "";
      speakQuestion(questions[currentIndex]);
    }
  }, [currentIndex, questions]);

  // Speech Recognition listener
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

      setAnswers((prev) => {
        const copy = [...prev];
        copy[currentIndex] = fullText;
        return copy;
      });
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
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
    baseTextRef.current = val;

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = val;
      return updated;
    });
  };

  const handleNext = async () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const targetId = id || Date.now().toString();

    if (currentIndex === questions.length - 1) {
      setIsSubmitting(true);
      let evaluatedData = null;

      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const evalRes = await fetch(`${baseUrl}/api/interviews/evaluate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            questions,
            answers,
            role,
          }),
        });
        const evalJson = await evalRes.json();
        if (evalRes.ok && evalJson.success) {
          evaluatedData = evalJson.evaluation;
        }
      } catch (err) {
        console.warn("AI Evaluation fetch failed:", err);
      }

      if (typeof saveInterview === "function") {
        saveInterview({
          id: targetId,
          setupConfig,
          questions,
          answers,
          evaluation: evaluatedData,
        });
      }

      navigate(`/interview-results/${targetId}`, {
        state: {
          answers,
          setupConfig,
          questions,
          evaluation: evaluatedData,
        },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (currentIndex > 0) {
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
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  navigate("/history");
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft size={16} /> Leave
              </button>
              <div>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <h1 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {role} ({difficulty})
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                navigate("/history");
              }}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 cursor-pointer"
            >
              End Interview
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Avatar & Question Display */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                  alt="AI Interviewer"
                  className="h-56 w-full object-cover object-top"
                />
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Interviewer Status
                  </span>

                  <button
                    type="button"
                    onClick={() => speakQuestion(currentQuestion)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 transition cursor-pointer"
                  >
                    <Volume2 size={14} className={isSpeaking ? "animate-pulse text-blue-600" : ""} />
                    {isSpeaking ? "Speaking..." : "Speak Question"}
                  </button>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-semibold leading-relaxed text-slate-800">
                    "{currentQuestion}"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Candidate Input */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Your Answer</h3>
                      <p className="text-xs text-slate-500">
                        {isListening ? "Recording... Speak now" : "Type or speak your response"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                      isListening
                        ? "animate-pulse border-red-200 bg-red-50 text-red-600"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-blue-600" />}
                    {isListening ? "Recording..." : "Voice Input"}
                  </button>
                </div>

                <textarea
                  value={currentAnswer}
                  onChange={handleTextChange}
                  placeholder="Type your response here or click 'Voice Input' to record..."
                  className="mt-4 min-h-[220px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0 || isSubmitting}
                  onClick={handlePrevious}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-60 active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Evaluating Answers...
                    </>
                  ) : isLastQuestion ? (
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