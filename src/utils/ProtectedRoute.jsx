import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {

   if (role === "admin") {
    const token = localStorage.getItem("adminToken");
    const r = localStorage.getItem("adminRole");
    return token && r === "admin" ? children : <Navigate to="/admin/login" />;
  }

  // Client check
  if (role === "client") {
    const token = localStorage.getItem("clientToken");
    const r = localStorage.getItem("clientRole");
    return token && r === "client" ? children : <Navigate to="/client/login" />;
  }

  return <Navigate to="/" />;
}
