import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HomeUser() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "AI Mental Health Screening",
      desc: "Get personalized insights with our advanced AI assessment tools designed to understand your mental wellness.",
      icon: "🧠",
      route: "/screening",
      color: "from-purple-500 to-indigo-600",
      bgColor: "from-purple-50 to-indigo-50",
      delay: "0ms",
    },
    {
      title: "24/7 AI Chat Support",
      desc: "Access instant, confidential support through our intelligent chatbot available around the clock.",
      icon: "💬",
      route: "/chatbot",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      delay: "150ms",
    },
    {
      title: "Professional Counseling",
      desc: "Book sessions with certified mental health professionals for personalized guidance and support.",
      icon: "📅",
      route: "/booking",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      delay: "300ms",
    },
    {
      title: "Community Support",
      desc: "Connect with others on similar journeys in our safe, moderated community forums.",
      icon: "🤝",
      route: "/forum",
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-50",
      delay: "450ms",
    },
    {
      title: "Wellness Resources",
      desc: "Access curated mental health resources, articles, and self-help tools for your journey.",
      icon: "📚",
      route: "/resources",
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-50",
      delay: "600ms",
    },
    {
      title: "Your Progress",
      desc: "Track your mental health journey and view your assessment history and improvements.",
      icon: "📊",
      route: "/screenings/history",
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-50 to-purple-50",
      delay: "750ms",
    },
  ];

  const infoOnlyFeatures = [
    {
      title: "AI Mental Health Screening",
      desc: "Take evidence-based AI mental health assessments and get confidential results you can discuss with counselors.",
      icon: "🧠",
      color: "from-purple-500 to-indigo-600",
      bgColor: "from-purple-50 to-indigo-50",
      delay: "0ms",
    },
    {
      title: "24/7 AI Chat Support",
      desc: "Our AI chat assistant is always online to listen and support you, day or night.",
      icon: "💬",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      delay: "150ms",
    },
    {
      title: "Professional Counseling",
      desc: "Book secure counseling sessions with certified mental health professionals.",
      icon: "📅",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      delay: "300ms",
    },
    {
      title: "Community Support",
      desc: "Join safe forums to share, learn, and connect with others who care.",
      icon: "🤝",
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-50",
      delay: "450ms",
    },
    {
      title: "Wellness Resources",
      desc: "Access self-help articles, guides, and recommended reading—free for all.",
      icon: "📚",
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-50",
      delay: "600ms",
    },
    {
      title: "Personal Progress Tracking",
      desc: "Monitor your growth with personal assessment history and improvement charts.",
      icon: "📊",
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-50 to-purple-50",
      delay: "750ms",
    },
  ];

  const quickActions = user
    ? [
        { label: "Start Assessment", route: "/screening", primary: true },
        { label: "Chat Now", route: "/chatbot", primary: false },
        { label: "Book Session", route: "/booking", primary: false },
        { label: "View History", route: "/screenings/history", primary: false },
      ]
    : []; // No quick actions for guests

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Welcome badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium text-gray-700 shadow-lg border border-white/50 mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {user ? <>Welcome back, {user.name || "User"}</> : <>Welcome to MindEase</>}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Mental Health
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 animate-pulse">
                Dashboard
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Continue your wellness journey with personalized tools, professional support, and a caring community.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {user ? (
                quickActions.map((action, index) => (
                  <button
                    key={action.route}
                    onClick={() => navigate(action.route)}
                    className={`
                      group relative overflow-hidden rounded-full px-6 py-3 font-semibold transition-all cursor-pointer duration-300 transform hover:scale-105 hover:shadow-xl
                      ${action.primary ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "bg-white/80 backdrop-blur-sm text-gray-700 shadow-md border border-white/50 hover:bg-white"}
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10">{action.label}</span>
                  </button>
                ))
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg text-center"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/about"
                    className="bg-white text-purple-700 font-bold px-8 py-4 rounded-full text-lg shadow-lg transition-all duration-300 hover:bg-blue-50 hover:scale-105"
                  >
                    About Portal
                  </Link>
                </>
              )}
            </div>
            {/* Stats or trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>100% Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features or Info Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {user ? "Your Wellness Tools" : "Features We Offer"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {user
                ? "Everything you need to support your mental health journey, all in one place."
                : "Discover all the tools and resources you'll unlock by joining our community."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(user ? features : infoOnlyFeatures).map((feature, index) => (
              <div
                key={index}
                className={`
                  group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100
                  transition-all duration-500 hover:shadow-xl hover:-translate-y-2
                  ${user ? "cursor-pointer" : ""}
                  opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]
                `}
                style={{ animationDelay: feature.delay }}
                onClick={user ? () => navigate(feature.route) : undefined}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700">
                    {feature.desc}
                  </p>
                  {user && (
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} text-white text-sm font-semibold shadow-md transform group-hover:scale-105 transition-all duration-300`}
                    >
                      <span>Get Started</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Contact Section at Bottom */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from people who found support and healing through our platform
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4 shadow-lg">A</div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Akhil S.</div>
                  <div className="text-sm text-gray-500">Engineering Student</div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-4xl text-blue-200 absolute -top-2 -left-2">"</div>
                <p className="text-gray-700 leading-relaxed relative z-10 pl-6">
                  The AI screening was incredibly insightful and helped me understand my mental health better. The community forum provides amazing support from people who truly understand.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-gray-400">2 months ago</span>
                <div className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Verified User
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4 shadow-lg">M</div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Megha K.</div>
                  <div className="text-sm text-gray-500">Working Professional</div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-4xl text-pink-200 absolute -top-2 -left-2">"</div>
                <p className="text-gray-700 leading-relaxed relative z-10 pl-6">
                  Having 24/7 chat support gives me incredible peace of mind, especially during tough times. The wellness resources have become part of my daily routine.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-gray-400">1 month ago</span>
                <div className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Verified User
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4 shadow-lg">R</div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Rajesh P.</div>
                  <div className="text-sm text-gray-500">College Student</div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-4xl text-emerald-200 absolute -top-2 -left-2">"</div>
                <p className="text-gray-700 leading-relaxed relative z-10 pl-6">
                  The professional counseling sessions have been life-changing. Being able to book easily and connect with qualified therapists made all the difference.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-gray-400">3 weeks ago</span>
                <div className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Verified User
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                <span className="font-medium">1000+ Success Stories</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="font-medium">4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"/>
                </svg>
                <span className="font-medium">Trusted by Students & Professionals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need Immediate Support?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Our support team is here to help you 24/7. Don't hesitate to reach out.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* 24/7 Helpline */}
            <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Emergency Helpline</h3>
                <p className="text-white/70 mb-4">Available 24/7 for crisis support</p>
                <a href="tel:+919999999999" className="inline-flex items-center gap-2 text-white font-semibold hover:text-pink-300 transition-colors">
                  <span className="text-lg">+91 18005990019</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Email Support */}
            <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Email Support</h3>
                <p className="text-white/70 mb-4">Get detailed help via email</p>
                <a href="mailto:support@mentalhealthsih.com" className="inline-flex items-center gap-2 text-white font-semibold hover:text-blue-300 transition-colors">
                  <span>distressmailsconnecting@gmail.com</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Live Chat */}
            <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
                <p className="text-white/70 mb-4">Instant support through chat</p>
                <button 
                  onClick={() => navigate('/chatbot')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 cursor-pointer to-teal-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <span>Start Chat</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="mt-16 pt-8 border-t border-white/20 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-sm">
                © 2025 Mental Health Portal. All rights reserved.
              </div>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Crisis Resources</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}














