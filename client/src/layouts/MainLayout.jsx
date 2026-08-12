import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px minmax(0, 1fr)",
          minHeight: "100vh",
        }}
      >
        <Sidebar />

        <div
          style={{
            minWidth: 0,
            minHeight: "100vh",
          }}
        >
          <Navbar />

          <main
            style={{
              padding: "32px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;