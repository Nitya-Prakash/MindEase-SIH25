// models/Screening.js
const mongoose = require("mongoose");

const screeningSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["PHQ-9", "GAD-7", "GHQ-12"],
    required: true,
  },
  responses: [
    {
      question: String,
      answer: Number,
    },
  ],
  score: { type: Number, required: true },
  riskLevel: {
    type: String,
    enum: ["Low", "Moderate", "High"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Screening", screeningSchema);
