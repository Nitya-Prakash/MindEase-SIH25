// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { connectDB } = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const screeningRoutes = require("./routes/screening");
const chatbotRoutes = require("./routes/chatbot");
const bookingRoutes = require("./routes/bookings");
const forumRoutes = require("./routes/forum");
const resourceRoutes = require("./routes/resources");
const adminRoutes = require("./routes/admin");
const { errorHandler } = require("./middleware/errorHandler");

console.log("🔧 Environment Check:");
console.log("PORT:", process.env.PORT || "Not Set");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing");
console.log("HF_API_KEY:", process.env.HF_API_KEY ? "✅ Set" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");
console.log(
  "GROQ_API_KEY:",
  process.env.GROQ_API_KEY ? "✅ Set" : "❌ Missing"
);

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mindease-sih25.vercel.app"],
    // your Vite frontend URL
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Serve uploaded files statically if stored locally
app.use("/uploads", express.static("public/uploads"));

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/screenings", screeningRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
