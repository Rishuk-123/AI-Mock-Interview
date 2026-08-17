import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* SIDEBAR CONTAINER */}
      <div className="w-64 shrink-0 bg-white">
        <Sidebar />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}