import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center text-slate-900">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
        <Sparkles size={32} />
      </div>
      <h1 className="mt-6 text-6xl font-extrabold tracking-tight text-slate-900">404</h1>
      <h2 className="mt-2 text-xl font-bold text-slate-800">Page Not Found</h2>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">
        The page you are looking for doesn't exist or has been moved to another path.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
      >
        <ArrowLeft size={16} /> Return to Dashboard
      </button>
    </div>
  );
}