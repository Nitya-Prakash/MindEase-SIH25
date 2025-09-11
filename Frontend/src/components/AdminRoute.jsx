import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("user") 
              ? JSON.parse(localStorage.getItem("user")).role 
              : null;

  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
