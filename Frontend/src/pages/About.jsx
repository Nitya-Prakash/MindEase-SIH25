import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 text-center sm:text-left">
          About Our Digital Mental Health Platform
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-8 text-center sm:text-left">
          Empowering students with accessible, stigma-free mental health support in higher education.
        </p>

        {/* Problem Context */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Challenge</h2>
          <p className="text-gray-700 mb-3">
            Mental health issues among college students, including anxiety, depression, burnout, sleep disorders, academic stress, and social isolation, are on the rise. Unfortunately, there is a significant gap in availability, accessibility, and stigma-free delivery of psychological support—particularly in rural and semi-urban institutions.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Absence of a structured, scalable, stigma-free psychological intervention system.</li>
            <li>Lack of early detection and preventive mental health tools.</li>
            <li>Under-utilization of college counselling centres due to fear of judgment or lack of awareness.</li>
            <li>No centralized mental health monitoring or data-driven policy framework.</li>
          </ul>
        </section>

        {/* Proposed Solution */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Solution</h2>
          <p className="text-gray-700 mb-3">
            Our platform offers a comprehensive Digital Psychological Intervention System designed specifically for higher education institutions. It includes:
          </p>
          <ul className="list-decimal list-inside text-gray-700 space-y-2">
            <li>
              <span className="font-semibold">AI-guided First-Aid Support:</span> An interactive chatbox providing coping strategies and referral to professionals when needed.
            </li>
            <li>
              <span className="font-semibold">Confidential Booking System:</span> Secure appointment scheduling with on-campus counsellors or helplines.
            </li>
            <li>
              <span className="font-semibold">Psychoeducational Resource Hub:</span> Videos, relaxation audio, and mental wellness guides available in regional languages.
            </li>
            <li>
              <span className="font-semibold">Peer Support Platform:</span> Moderated peer-to-peer forums with trained student volunteers.
            </li>
            <li>
              <span className="font-semibold">Admin Dashboard:</span> Anonymous analytics to help authorities track trends and plan interventions.
            </li>
          </ul>
        </section>

        {/* Why This Platform */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why We Built This Platform</h2>
          <p className="text-gray-700 mb-3">
            Most available mental health apps are generic, Western-oriented, or paid. They lack:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Integration of regional cultural context and local language.</li>
            <li>Customization for institution-specific needs.</li>
            <li>Offline support mapping, linking students with college counsellors.</li>
            <li>Real-time analytics for administrators.</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Our open-source solution bridges these gaps to provide accessible, scalable, and stigma-free mental health support.
          </p>
        </section>

        {/* Call to Action */}
<section className="text-center mt-10 space-y-4">
  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
    Join Us in Making Mental Health Accessible
  </h2>
  <p className="text-gray-700 mb-6">
    Explore resources, connect with peers, and leverage AI-guided support to take proactive care of your mental well-being.
  </p>
  <div className="flex flex-col sm:flex-row justify-center gap-4">
    <a
      href="/login"
      className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
    >
      Login
    </a>
    <a
      href="/register"
      className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
    >
      Register
    </a>
  </div>
</section>

      </div>
    </div>
  );
}
