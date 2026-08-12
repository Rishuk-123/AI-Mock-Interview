import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen pl-[250px]">
        <Navbar />

        <main className="w-full min-w-0 px-6 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;