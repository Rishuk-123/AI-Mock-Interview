import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar />

      <div
        className="min-h-screen"
        style={{
          marginLeft: "250px",
        }}
      >
        <Navbar />

        <main className="w-full min-w-0 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;