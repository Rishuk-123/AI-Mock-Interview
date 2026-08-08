import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div
        style={{
          marginLeft: "280px",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;