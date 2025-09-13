import React from "react";
import { Link } from "react-router-dom";

export default function HomeAdmin() {
  const features = [
    {
      title: "Crisis Alerts",
      desc: "Monitor and manage crisis situations in real-time.",
      to: "/admin/crises",
      color: "from-red-400 to-red-600",
    },
    {
      title: "Screening Alerts",
      desc: "View flagged screenings and take necessary action.",
      to: "/admin/screening-alerts",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Chat Support",
      desc: "Oversee ongoing chat sessions and assist users.",
      to: "/chatbot",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Forum",
      desc: "Moderate community discussions and user posts.",
      to: "/forum",
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "Resources",
      desc: "Add, update, and manage educational resources.",
      to: "/resources",
      color: "from-green-400 to-green-600",
    },
    {
      title: "Profile",
      desc: "Manage your admin account and settings.",
      to: "/profile",
      color: "from-gray-400 to-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm">2025</p>
      </header>

      {/* Welcome Section */}
      <section className="p-6 sm:p-10 text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Welcome, Admin 👋
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Proactively oversee user activities, manage screenings, monitor and respond to crisis situations, supervise chat interactions, moderate forums, and maintain community resources to ensure a secure, organized, and thriving platform environment.
        </p>
      </section>

      {/* Feature Grid */}
      <main className="flex-1 p-6 sm:p-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <Link
              key={idx}
              to={f.to}
              className="relative overflow-hidden rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${f.color} opacity-70`}
              ></div>

              {/* Content */}
              <div className="relative p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center font-bold text-lg text-gray-800">
                    {f.title[0]}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white text-sm">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-500 text-center p-4 text-sm">
        © 2025 SIH-25
      </footer>
    </div>
  );
}
