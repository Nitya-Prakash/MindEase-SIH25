import React from "react";
import { Link } from "react-router-dom";

export default function HomeAdmin() {
  const features = [
    {
      title: "Crisis Alerts",
      desc: "Monitor and manage crisis situations in real-time.",
      to: "/admin/crises",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Screening Alerts",
      desc: "View flagged screenings and take necessary action.",
      to: "/admin/screening-alerts",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Chat Support",
      desc: "Oversee ongoing chat sessions and assist users.",
      to: "/admin/chat-support",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Forum",
      desc: "Moderate community discussions and user posts.",
      to: "/admin/forum",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Resources",
      desc: "Add, update, and manage educational resources.",
      to: "/resources",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Profile",
      desc: "Manage your admin account and settings.",
      to: "/admin/profile",
      color: "from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <div className="px-6 py-8 border-b border-gray-700">
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">SIH-25 Portal</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3">
          {features.map((f, idx) => (
            <Link
              key={idx}
              to={f.to}
              className="block px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition"
            >
              {f.title}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-700 text-sm text-gray-400">
          © 2025 SIH-25
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, Admin 👋
        </h2>
        <p className="text-gray-600 mb-10">
          Manage users, monitor screenings, oversee crisis situations, and keep
          the community safe.
        </p>

        {/* Feature Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <Link
              key={idx}
              to={f.to}
              className={`p-6 rounded-xl shadow-md bg-white border hover:shadow-lg transition transform hover:-translate-y-1`}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${f.color} flex items-center justify-center text-white font-bold text-lg mb-4`}
              >
                {f.title[0]}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
