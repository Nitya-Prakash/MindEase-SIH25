import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const phq9Questions = [
  "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
  "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
  "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
  "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
  "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
  "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure or have let yourself or your family down?",
  "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
  "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
  "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself?"
];

const answerOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
];

export default function Screening() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [step]: value }));
  };

  const nextStep = () => {
    if (step < phq9Questions.length - 1) {
      setStep(step + 1);
    } else {
      submitAnswers();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const submitAnswers = async () => {
    setLoading(true);
    setError("");

    try {
      const responses = phq9Questions.map((question, index) => ({
        question,
        answer: answers[index] || 0,
      }));

      const payload = {
        type: "PHQ-9",
        responses,
      };

      const { data } = await api.post("/screenings", payload);
      setResult(data);
    } catch (err) {
      console.error("Screening submission error:", err);
      setError(
        err.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskLevelMessage = (level) => {
    switch (level) {
      case "High":
        return "Your responses indicate you may be experiencing significant depression symptoms. We strongly recommend speaking with a mental health professional.";
      case "Moderate":
        return "Your responses suggest you may be experiencing moderate depression symptoms. Consider reaching out to a counselor or therapist.";
      case "Low":
        return "Your responses indicate minimal depression symptoms. Continue monitoring your mental health and practice self-care.";
      default:
        return "Assessment completed.";
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">
              Screening Complete
            </h1>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-indigo-600 h-2 rounded-full w-full"></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-indigo-600 mb-2">
                {result.screening.score}
              </div>
              <div className="text-gray-600">Total Score (out of 27)</div>
            </div>

            <div
              className={`p-4 rounded-lg border ${getRiskLevelColor(
                result.screening.riskLevel
              )}`}
            >
              <div className="text-center">
                <div className="text-xl font-semibold mb-2">
                  Risk Level: {result.screening.riskLevel}
                </div>
                <p className="text-sm">
                  {getRiskLevelMessage(result.screening.riskLevel)}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Consider speaking with our chatbot for immediate support</li>
                <li>• Book a session with one of our counselors</li>
                <li>• Explore our mental health resources</li>
                {result.screening.riskLevel === "High" && (
                  <li className="text-red-600 font-semibold">
                    • Seek immediate professional help if you're having thoughts of self-harm
                  </li>
                )}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => (window.location.href = "/chatbot")}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Chat Support
              </button>
              <button
                onClick={() => (window.location.href = "/booking")}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Book Session
              </button>
              <button
                onClick={() => (window.location.href = "/resources")}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Resources
              </button>
            </div>

            {/* View History button */}
            <div className="mt-8 text-center">
              <Link
                to="/screenings/history"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                View Screening History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Top “History” link */}
        <div className="flex justify-end mb-4">
          <Link to="/screenings/history" className="text-indigo-600 hover:underline">
            View Screening History
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
            PHQ-9 Depression Screening
          </h1>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / phq9Questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-gray-600">
            Question {step + 1} of {phq9Questions.length}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 leading-relaxed">
            {phq9Questions[step]}
          </h2>

          <div className="space-y-3">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-all ${
                  answers[step] === option.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[step] === option.value
                        ? "bg-white border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {answers[step] === option.value && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              step === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={answers[step] == null || loading}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              answers[step] == null || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {step < phq9Questions.length - 1
              ? "Next"
              : loading
              ? "Submitting..."
              : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
