const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "bot"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    messages: [messageSchema],
    // New fields:
    crisisAlert: { type: Boolean, default: false },
    crisisReason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
