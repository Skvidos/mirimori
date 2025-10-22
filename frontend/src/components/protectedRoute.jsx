import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!(user.isAdmin || user.isMods)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
