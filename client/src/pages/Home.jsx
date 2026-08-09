import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-300 bg-white p-8 text-center shadow-lg">
        <h1 className="text-5xl font-bold text-slate-900">
          AI Mock Interview Platform
        </h1>

        <p className="mt-4 text-xl text-slate-500">
          Practice interviews with AI and improve your skills.
        </p>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;