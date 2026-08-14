import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">

      {/* Sidebar */}
      <aside className="w-[350px] shrink-0 bg-white">
        <Sidebar />
      </aside>

      {/* RIGHT SIDE */}
      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="min-w-0 bg-slate-50">
          {children}
        </main>

      </div>

    </div>
  );
}

export default MainLayout;