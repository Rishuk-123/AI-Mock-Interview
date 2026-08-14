import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen grid-cols-[280px_1fr]">

        {/* Sidebar */}
        <aside className="border-r border-slate-200 bg-white">
          <Sidebar />
        </aside>

        {/* Main Area */}
        <div className="min-w-0">

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="min-w-0">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}

export default MainLayout;