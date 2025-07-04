import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteWithRole = ({ allowedRole, children }) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRouteWithRole;
