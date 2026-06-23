import { Navigate } from "react-router-dom";

function getUserRole() {
  // Supports either:
  // localStorage.setItem("role", "vendor")
  // or localStorage.setItem("user", JSON.stringify({ role: "vendor" }))
  const storedRole = localStorage.getItem("role");

  if (storedRole) {
    return storedRole.toLowerCase();
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return (user?.role || "").toLowerCase();
  } catch {
    return "";
  }
}

export default function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
