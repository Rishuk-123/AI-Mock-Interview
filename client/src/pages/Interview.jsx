import  { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Mic, Send, Volume2, MicOff, ArrowLeft } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Read configuration or dynamic questions passed from InterviewSetup
  const setupConfig = location.state?.setupConfig || {
    role: "Frontend Developer",
    difficulty: "Medium",
    type: "Technical",
  };

  const initialQuestions = location.state?.questions || [
    "Hi there, it's great to meet you today. Tell me about a challenging project you recently completed.",
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const currentQuestion = questions[currentIndex] || "";

  // 1. Text-To-Speech (AI Speaks)
  const speakText = (text) => {
    if (!("speechSynthesis" in window) || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.includes("en"));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Speak question whenever question index changes
  useEffect(() => {
    if (currentQuestion) {
      speakText(currentQuestion);
    }
  }, [currentIndex, currentQuestion]);

  // 2. Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 3. Speech Recognition (User Voice Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your response.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 4. Submit Answer & Call Backend API / Next Question
  const handleSubmit = async () => {
    if (!answer.trim()) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setAnswer("");
    setTimeLeft(60);

    // If more pre-generated questions exist, advance to the next one
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // Interactive conversational mode if no fixed questions list remaining
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${baseUrl}/api/interview/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: answer,
          role: setupConfig.role,
          difficulty: setupConfig.difficulty,
        }),
      });

      const data = await response.json();

      if (data.isFinished || currentIndex >= 4) {
        navigate(`/interview-results/${id || Date.now()}`, {
          state: {
            questions,
            answers: updatedAnswers,
            setupConfig,
          },
        });
      } else {
        const nextQuestion = data.reply || "Thank you. Let's move to the next topic.";
        setQuestions((prev) => [...prev, nextQuestion]);
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to connect to AI server:", error);
      // Fallback navigate to results if server interaction fails
      navigate(`/interview-results/${id || Date.now()}`, {
        state: {
          questions,
          answers: updatedAnswers,
          setupConfig,
        },
      });
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex items-center justify-center font-sans">
        <div className="w-full max-w-6xl rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                navigate("/history");
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              <ArrowLeft size={16} /> Exit Session
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {setupConfig.role} • {setupConfig.difficulty}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Panel: Avatar & Status */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xs bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                  alt="AI Interviewer"
                  className="w-full h-56 object-cover object-top"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  "{currentQuestion}"
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Interview Status
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <Volume2 size={14} className={isSpeaking ? "animate-pulse" : ""} />
                    {isSpeaking ? "AI Speaking" : "Listening..."}
                  </span>
                </div>

                <div className="mt-5 flex justify-center">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-600 bg-blue-50 text-slate-900 font-extrabold text-lg shadow-inner">
                    {timeLeft}s
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Response Area */}
            <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-slate-50 border border-slate-200 p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight">
                  Question {currentIndex + 1} of {questions.length}
                </h2>
              </div>

              <div className="flex-1 flex flex-col">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer or use voice input..."
                  className="w-full flex-1 min-h-[280px] resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-2xs transition"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
                    isListening
                      ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-blue-600" />}
                  {isListening ? "Listening..." : "Voice Input"}
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
                >
                  {currentIndex === questions.length - 1 ? "Finish" : "Submit"} <Send size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}