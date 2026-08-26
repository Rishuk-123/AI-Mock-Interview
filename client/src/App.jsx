import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Resume from "./pages/Resume";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewResults from "./pages/InterviewResults";
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";

import useAuthStore from "./store/authStore";

function App() {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* SETUP ROUTES (Supports both /interview and /interview-setup) */}
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <InterviewSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-setup"
        element={
          <ProtectedRoute>
            <InterviewSetup />
          </ProtectedRoute>
        }
      />

      {/* RESULTS ROUTES (Supports all variations to prevent 404) */}
      <Route
        path="/interview/:id/results"
        element={
          <ProtectedRoute>
            <InterviewResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-results/:id"
        element={
          <ProtectedRoute>
            <InterviewResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-results"
        element={
          <ProtectedRoute>
            <InterviewResults />
          </ProtectedRoute>
        }
      />

      {/* LIVE INTERVIEW SESSION ROOM */}
      <Route
        path="/interview/:id"
        element={
          <ProtectedRoute>
            <InterviewRoom />
          </ProtectedRoute>
        }
      />

      {/* OTHER PROTECTED PAGES */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pricing"
        element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        }
      />

      {/* CATCH-ALL UNKNOWN ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;