import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("auth-token");

  // You could add more robust token validation here if needed
  // For example, decoding the token to check for an admin role or expiry

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
