import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute token:", token);

  if (!token) {
    console.log("Redirecting to login");
    return <Navigate to="/login" />;
  }

  console.log("Rendering protected content");
  return children;
};

export default ProtectedRoute;
