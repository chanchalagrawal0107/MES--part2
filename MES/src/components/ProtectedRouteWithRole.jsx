// components/ProtectedRouteWithRole.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteWithRole = ({ children, allowedRole }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRouteWithRole;
