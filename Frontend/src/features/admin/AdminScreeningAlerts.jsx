// src/features/admin/AdminScreeningAlerts.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { AlertTriangle, Calendar, Clock, User } from "lucide-react";

const answerLabels = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

export default function AdminScreeningAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHighRisk() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/admin/screening-alerts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setAlerts(res.data.screenings);
        } else {
          setError("Failed to load screenings.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load high-risk screenings.");
      } finally {
        setLoading(false);
      }
    }
    fetchHighRisk();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Loading high-risk screenings...
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );
  }
  if (!alerts.length) {
    return (
      <div className="p-6 text-center text-gray-700 font-medium">
        No high-risk screenings at this time.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-red-700 flex items-center justify-center gap-2">
        <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
        High-Risk Screening Alerts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <div
            key={alert._id}
            className="bg-white shadow-md rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition flex flex-col"
          >
            {/* Header with user info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="truncate">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {alert.user?.name || "Unknown User"}
                  </h2>
                  {alert.user?.email && (
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {alert.user.email}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{alert.type} Screening</p>
                </div>
              </div>
              <span className="self-start sm:self-center px-2 sm:px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-xs uppercase tracking-wide">
                High Risk
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(alert.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(alert.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Score */}
            <p className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
              Score:{" "}
              <span className="text-red-700 text-lg font-bold">
                {alert.score}
              </span>
            </p>

            {/* Responses */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 max-h-56 sm:max-h-60 overflow-y-auto border border-gray-200">
              <p className="font-semibold mb-2 text-gray-800 text-sm">
                Responses:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs sm:text-sm">
                {alert.responses.map((r, i) => (
                  <li key={i} className="leading-snug">
                    <span className="font-medium">{r.question}</span>:{" "}
                    <span className="italic text-indigo-700">
                      {r.answer != null && answerLabels[r.answer]
                        ? answerLabels[r.answer]
                        : r.answer}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
