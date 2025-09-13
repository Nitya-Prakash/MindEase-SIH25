// src/services/authService.js
import api from "./api";

// Register user
export const register = async (formData) => {
  const res = await api.post("/auth/register", formData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token); // save token locally
  }
  return res.data;
};

// Login user
export const login = async (formData) => {
  const res = await api.post("/auth/login", formData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token); // save token locally
  }
  return res.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
};
