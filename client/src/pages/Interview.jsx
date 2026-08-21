import React, { useState, useEffect } from "react";
import { Mic, Send, Volume2, MicOff } from "lucide-react";

export default function Interview() {
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [aiQuestion, setAiQuestion] = useState(
    "Hi there, it's great to meet you today. Tell me about a challenging project you recently completed."
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 1. Text-To-Speech (AI Speaks)
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak initial question on page load
  useEffect(() => {
    speakText(aiQuestion);
  }, []);

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

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  // 4. Submit Answer & Call Backend API
  const handleSubmit = async () => {
    if (!answer.trim()) return;

    const userText = answer;
    setAnswer("");
    setTimeLeft(60);

    try {
      // Replace URL with your backend server URL
      const response = await fetch(
        "https://ai-mock-interview-kn7p.onrender.com/api/interview/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAnswer: userText }),
        }
      );

      const data = await response.json();
      const nextQuestion = data.reply || "Thank you. Let's move to the next topic.";
      
      setAiQuestion(nextQuestion);
      speakText(nextQuestion);
    } catch (error) {
      console.error("Failed to connect to AI server:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
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

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-2xs">
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                "{aiQuestion}"
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
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
                AI Smart Interview
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
                Submit <Send size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}