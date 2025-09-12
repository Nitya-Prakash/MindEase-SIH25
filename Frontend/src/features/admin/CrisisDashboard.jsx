// src/features/admin/CrisisDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function CrisisDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/admin/crises", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setAlerts(res.data);
      } catch (err) {
        console.error("Failed to fetch crisis alerts:", err);
        setError("Unable to load crisis alerts.");
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading crisis alerts...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }
  if (!alerts.length) {
    return <div className="p-6 text-center">No crisis alerts at this time.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      
      <h1 className="text-2xl font-bold mb-4">Crisis Alerts</h1>
      
      <ul className="divide-y">
        {alerts.map((conv) => (
          <li key={conv._id} className="py-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-semibold">
                  {conv.user.name} ({conv.user.email})
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(conv.updatedAt).toLocaleString()}
                </div>
              </div>
              <span className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded">
                High Risk
              </span>
            </div>
            <div className="mt-2 text-gray-800 whitespace-pre-line">
              {conv.crisisReason || "No reason provided."}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
