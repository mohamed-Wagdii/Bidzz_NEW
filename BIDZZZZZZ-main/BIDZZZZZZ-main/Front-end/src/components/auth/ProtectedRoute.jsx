import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to={user.role === "seller" ? "/seller-dashboard" : "/buyer-dashboard"} replace />;
  }
  return children;
}
