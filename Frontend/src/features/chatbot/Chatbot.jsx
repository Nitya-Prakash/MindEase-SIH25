import React, { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { v4 as uuidv4 } from "uuid";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef();

  // Load previous history on mount
  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data } = await api.get("/api/chatbot/history");
        let loadedMessages = [];
        if (data.success && data.history) {
          loadedMessages = data.history.map((msg) => ({
            id: uuidv4(),
            from: msg.sender,
            text: msg.text,
            timestamp: new Date(),
          }));
        }
        setMessages([
          {
            id: uuidv4(),
            from: "bot",
            text: "Hello! I'm here to support you. How are you feeling today?",
            timestamp: new Date(),
          },
          ...loadedMessages,
        ]);
      } catch {
        setMessages([
          {
            id: uuidv4(),
            from: "bot",
            text: "Hello! I'm here to support you. How are you feeling today?",
            timestamp: new Date(),
          },
        ]);
      }
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: uuidv4(),
      from: "user",
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const messageText = input.trim();
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/api/chatbot/chat", { message: messageText });
      const botText = data.data.message;

      const botMsg = {
        id: uuidv4(),
        from: "bot",
        text: botText || "I'm here to help. Can you tell me more?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      let errorMessage = "I'm having trouble connecting right now. Please try again.";
      if (err.response?.status === 500) {
        errorMessage = "I'm experiencing technical difficulties. Please try again in a moment.";
      } else if (err.response?.status === 503) {
        errorMessage = "I'm currently starting up. Please try again in 30 seconds.";
      } else if (err.code === "NETWORK_ERROR") {
        errorMessage = "Connection issue. Please check your internet and try again.";
      }
      const errMsg = {
        id: uuidv4(),
        from: "bot",
        text: errorMessage,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearChat = async () => {
    try {
      await api.post("/chatbot/clear");
      setMessages([
        {
          id: uuidv4(),
          from: "bot",
          text: "Hello! I'm here to support you. How are you feeling today?",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto h-[700px] bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-700 text-white p-5 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">MindMate Chat</h2>
          <p className="text-indigo-200 mt-1 select-none">Here to listen & support you 24/7</p>
        </div>
        <button
          onClick={handleClearChat}
          disabled={loading}
          className="bg-red-800 hover:bg-red-700 rounded-md px-4 py-2 transition duration-300 select-none shadow-md cursor-pointer"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100 flex flex-col">
  {messages.map((msg) => (
    <div
      key={msg.id}
      className={`max-w-[80%] break-words p-4 rounded-lg shadow transition-opacity duration-500 ease-in-out animate-fade-in ${
        msg.from === "user"
          ? "bg-indigo-600 text-white self-end rounded-br-none"
          : msg.isError
          ? "bg-red-100 text-red-700 border border-red-400 self-start rounded-bl-none"
          : "bg-indigo-100 text-indigo-900 self-start rounded-bl-none"
      }`}
      style={{
        borderTopLeftRadius: msg.from === "user" ? "0.75rem" : "0",
        borderTopRightRadius: msg.from === "user" ? "0" : "0.75rem",
      }}
    >
      <p className="whitespace-pre-wrap">{msg.text}</p>
      <span className="block mt-2 text-xs opacity-60 select-none text-right">
        {msg.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  ))}
  {/* Loading and bottom ref */}
  {loading && (
    <div className="max-w-[80%] bg-indigo-100 text-indigo-900 rounded-bl-none self-start p-4 flex items-center space-x-3 animate-pulseShadow shadow-indigo-300 shadow-md">
      <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
      <span>Thinking...</span>
    </div>
  )}
  <div ref={bottomRef} />
</div>


      {/* Input Area */}
      <div className="bg-indigo-50 border-t border-indigo-200 p-4 flex items-center space-x-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message here..."
          rows="1"
          disabled={loading}
          className="flex-grow resize-none rounded-md border border-indigo-300 p-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm"
          aria-label="Message input"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute bottom-20 left-4 right-4 bg-red-100 border-l-4 border-red-600 text-red-700 p-4 rounded shadow-md z-50 select-none">
          <p>{error}</p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in forwards;
        }
        @keyframes pulseShadow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
          }
          50% {
            box-shadow: 0 0 12px rgba(99, 102, 241, 1);
          }
        }
        .animate-pulseShadow {
          animation: pulseShadow 1.5s infinite ease-in-out;
        }
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .max-w-[80%] {
            max-width: 90% !important;
          }
        }
      `}</style>
    </div>
  );
}
