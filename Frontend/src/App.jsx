import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import HomeUser from "./pages/HomeUser";
import HomeAdmin from "./pages/HomeAdmin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Screening from "./features/screening/Screening";
import Chatbot from "./features/chatbot/Chatbot";
import Booking from "./features/booking/Booking";
import Forum from "./features/forum/Forum";
import Resources from "./features/resources/Resources";
import CrisisDashboard from "./features/admin/CrisisDashboard";
import AdminRoute from "./components/AdminRoute";
import ScreensHistory from "./pages/ScreensHistory";
import AdminScreeningAlerts from "./features/admin/AdminScreeningAlerts";
import About from "./pages/About";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed requests 2 times
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1, // Retry failed mutations once
      retryDelay: 1000,
    },
  },
});

function RoleHomeRedirect() {
  // Get user from localStorage, fallback to public Home if not logged in
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  if (!user) return <HomeUser />;
  if (user.role === "admin") return <HomeAdmin />;
  return <HomeUser />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<RoleHomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              
              {/* Profile routes - both view and edit use the same component */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<Profile />} />
              
              <Route path="/screening" element={<Screening />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/screenings/history" element={<ScreensHistory />} />
              
              {/* Admin routes */}
              <Route
                path="/admin/crises"
                element={
                  <AdminRoute>
                    <CrisisDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/screening-alerts"
                element={
                  <AdminRoute>
                    <AdminScreeningAlerts />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}