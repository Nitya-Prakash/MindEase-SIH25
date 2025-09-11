// src/pages/ScreensHistory.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ScreensHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data } = await api.get("/screenings");
        if (data.success) setHistory(data.screenings);
      } catch (err) {
        console.error("Fetch history error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const riskColor = level => {
    if (level === "High") return "text-red-600 bg-red-50";
    if (level === "Moderate") return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!history.length) {
    return <div className="p-6 text-center">No past screenings found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Your Screening History</h1>
      <ul className="space-y-4">
        {history.map(s => (
          <li key={s._id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.type}</div>
              <div className="text-sm text-gray-600">
                {new Date(s.createdAt).toLocaleDateString()} at{" "}
                {new Date(s.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full font-medium ${riskColor(s.riskLevel)}`}>
              {s.riskLevel} ({s.score})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
