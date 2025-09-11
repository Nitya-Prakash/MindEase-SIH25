import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const role = user ? user.role : null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          MindEase
        </Link>

        {/* Return to Home button if not on home */}
        {location.pathname !== "/" && (
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/");
            }}
            className="hidden md:inline bg-white text-indigo-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-indigo-50 transition mr-4"
            aria-label="Return to home"
          >
            Return to Home
          </button>
        )}

        {/* Hamburger Button */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-1 w-full rounded bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-3" : ""
            }`}
          />
          <span
            className={`h-1 w-full rounded bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-1 w-full rounded bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-3" : ""
            }`}
          />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center space-x-6">
          {token ? (
            <>
              {role === "admin" ? (
                <>
                  <Link
                    to="/admin/crises"
                    className="hover:text-pink-300 transition"
                  >
                    Crisis Alerts
                  </Link>
                  <Link
                    to="/admin/screening-alerts"
                    className="hover:text-pink-300 transition"
                  >
                    Screening Alerts
                  </Link>
                  <Link
                    to="/chatbot"
                    className="hover:text-pink-300 transition"
                  >
                    Chat Support
                  </Link>
                  <Link to="/forum" className="hover:text-pink-300 transition">
                    Forum
                  </Link>
                  <Link
                    to="/resources"
                    className="hover:text-pink-300 transition"
                  >
                    Resources
                  </Link>
                  <Link to="/profile" className="hover:text-pink-300 transition">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-100 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/screening"
                    className="hover:text-pink-300 transition"
                  >
                    Screenings
                  </Link>
                  <Link to="/chatbot" className="hover:text-pink-300 transition">
                    Chat Support
                  </Link>
                  <Link to="/booking" className="hover:text-pink-300 transition">
                    Booking
                  </Link>
                  <Link to="/forum" className="hover:text-pink-300 transition">
                    Forum
                  </Link>
                  <Link
                    to="/resources"
                    className="hover:text-pink-300 transition"
                  >
                    Resources
                  </Link>
                  <Link to="/profile" className="hover:text-pink-300 transition">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-100 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-pink-300 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-pink-300 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-indigo-700 via-purple-700 to-pink-700 shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start space-y-6 p-6 text-lg">
          {token ? (
            <>
              {role === "admin" ? (
                <>
                  <Link to="/admin/crises" onClick={() => setMenuOpen(false)}>
                    Crisis Alerts
                  </Link>
                  <Link
                    to="/admin/screening-alerts"
                    onClick={() => setMenuOpen(false)}
                  >
                    Screening Alerts
                  </Link>
                  <Link to="/chatbot" onClick={() => setMenuOpen(false)}>
                    Chat Support
                  </Link>
                  <Link to="/forum" onClick={() => setMenuOpen(false)}>
                    Forum
                  </Link>
                  <Link to="/resources" onClick={() => setMenuOpen(false)}>
                    Resources
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-red-300 hover:text-red-100 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/screening" onClick={() => setMenuOpen(false)}>
                    Screenings
                  </Link>
                  <Link to="/chatbot" onClick={() => setMenuOpen(false)}>
                    Chat Support
                  </Link>
                  <Link to="/booking" onClick={() => setMenuOpen(false)}>
                    Booking
                  </Link>
                  <Link to="/forum" onClick={() => setMenuOpen(false)}>
                    Forum
                  </Link>
                  <Link to="/resources" onClick={() => setMenuOpen(false)}>
                    Resources
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-red-300 hover:text-red-100 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}

          {/* Mobile Return to Home button if not at home */}
          {location.pathname !== "/" && (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/");
              }}
              className="mt-auto w-full bg-white text-indigo-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-indigo-50 transition"
              aria-label="Return to home"
            >
              Return to Home
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
