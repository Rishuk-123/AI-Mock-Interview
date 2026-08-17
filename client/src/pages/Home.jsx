import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Top Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            InterviewPro
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-6 pt-16 pb-20 text-center">
        <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
          ✨ Powered by Intelligent AI Scoring
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Ace Your Next Tech Interview <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            With Instant AI Feedback
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Practice realistic technical and behavioral interview scenarios. Get detailed insights on your technical depth, communication clarity, and problem-solving skills.
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
          >
            Start Practice Interview
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Learn More
          </button>
        </div>

        {/* Dashboard UI Preview Card */}
        <div className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl sm:p-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-6">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-amber-400"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
            <span className="ml-2 text-xs font-mono text-slate-400">interview-session-preview.ai</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500">Technical Depth</span>
              <div className="text-2xl font-extrabold text-blue-600 mt-1">92 / 100</div>
              <div className="mt-2 text-xs text-slate-500">Strong explanation of data structures.</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500">Communication</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">88 / 100</div>
              <div className="mt-2 text-xs text-slate-500">Clear pacing and structured answers.</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500">Problem Solving</span>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">95 / 100</div>
              <div className="mt-2 text-xs text-slate-500">Optimal algorithmic time complexity.</div>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="mt-20 grid gap-6 text-left sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-3 text-lg font-bold text-blue-600">⚡ Real-time Feedback</div>
            <p className="text-sm leading-relaxed text-slate-500">
              Receive immediate evaluation on your code efficiency, speech pace, and technical accuracy right after every session.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-3 text-lg font-bold text-emerald-600">🎯 Role-Specific Tracks</div>
            <p className="text-sm leading-relaxed text-slate-500">
              Tailor mock sessions for Frontend, Backend, System Design, or Full-Stack software engineering positions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:col-span-2 md:col-span-1">
            <div className="mb-3 text-lg font-bold text-indigo-600">📊 Progress Analytics</div>
            <p className="text-sm leading-relaxed text-slate-500">
              Track historical performance scores and highlight weak spots across all practice attempts over time.
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} InterviewPro. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;