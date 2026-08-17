import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, Video, ArrowRight, Bot, User, Sparkles } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const currentQuestion =
    "Can you explain the Virtual DOM in React and how it optimizes UI updates?";

  const handleFinish = () => {
    navigate(`/interview/${id || "1"}/results`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-7 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                Question 1 of 5
              </span>
              <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
                Frontend Developer Session
              </h1>
            </div>

            <button
              onClick={handleFinish}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/20 transition hover:bg-red-500"
            >
              End Interview
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* AI QUESTION BOX */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Interviewer</h3>
                  <p className="text-xs text-slate-500">Asking core technical concepts</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  "{currentQuestion}"
                </p>
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
                    <h3 className="text-sm font-bold text-slate-900">Your Answer</h3>
                    <p className="text-xs text-slate-500">Speak or type your response</p>
                  </div>
                </div>

                <button
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
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here or speak using your microphone..."
                className="mt-4 flex-1 min-h-[160px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />

              <button
                onClick={handleFinish}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
              >
                Submit & Next Question <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}