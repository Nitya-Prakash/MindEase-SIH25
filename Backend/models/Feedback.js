const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  content: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  responded: { type: Boolean, default: false },
  response: { type: String },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
