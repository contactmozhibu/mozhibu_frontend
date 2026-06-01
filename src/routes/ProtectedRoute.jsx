import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // If not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → allow access
  return <Outlet />;
}
