import { Navigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;