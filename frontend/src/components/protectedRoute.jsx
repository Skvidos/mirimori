import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, user, requiredRole }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "admin" && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "mod" && !(user.isAdmin || user.isMods)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
