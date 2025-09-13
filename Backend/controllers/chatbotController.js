// controllers/chatbotController.js
const axios = require("axios");
const Conversation = require("../models/Conversation");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// In-memory conversation storage
const conversations = new Map();

// Call Groq API with retry + timeout
async function callGroqAPI(message, userId = "anonymous") {
  let history = conversations.get(userId) || [];

  if (history.length === 0) {
    history.push({
      role: "system",
      content: `You are MindEase, a warm and empathetic mental health support assistant. 
      Your goal is to provide only varied, personalized, and contextual mental health support.
      If a user asks about topics outside mental health, respond briefly but always remind the user 
      gently that your focus is mental health support and encourage returning to those topics.`,
    });
  }

  history.push({ role: "user", content: message });

  // Keep only last 8 exchanges + system prompt
  if (history.length > 17) {
    history = [history[0], ...history.slice(-16)];
  }

  conversations.set(userId, history);

  let attempt = 0;
  while (attempt < 2) {
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: "llama-3.1-8b-instant",
          messages: history,
          max_tokens: 200, // shorter response for speed
          temperature: 0.9,
          top_p: 0.9,
          frequency_penalty: 0.3,
          presence_penalty: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15s timeout
        }
      );

      const botReply = response.data.choices[0].message.content;
      history.push({ role: "assistant", content: botReply });
      conversations.set(userId, history);

      return botReply;
    } catch (err) {
      attempt++;
      console.error(
        `❌ Groq API error (attempt ${attempt}):`,
        err.response?.data || err.message
      );

      if (attempt >= 2) {
        return "⚠️ I'm having trouble responding right now. Please try again.";
      }
    }
  }
}

// Main chatbot controller
async function chatWithBot(req, res) {
  try {
    const { message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ success: false, error: "Message is required" });
    }

    const userId =
      (req.user && req.user._id.toString()) ||
      `anon_${req.ip.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const isAuthenticated = Boolean(req.user);

    console.log(`💬 Chat from ${userId}: "${message}"`);

    // Get AI response
    const botResponse = await callGroqAPI(message, userId);

    // Load or create conversation document in MongoDB
    let convoDoc = await Conversation.findOne({ user: req.user?._id });
    if (!convoDoc) {
      convoDoc = new Conversation({
        user: req.user?._id || null,
        messages: [],
      });
    }

    // Append messages
    convoDoc.messages.push({ sender: "user", text: message });
    convoDoc.messages.push({ sender: "bot", text: botResponse });

    // Crisis flag
    if (req.crisisDetected) {
      convoDoc.crisisAlert = true;
      convoDoc.crisisReason = req.crisisReason;
    }

    await convoDoc.save();

    // Response payload
    const responseData = {
      success: true,
      data: {
        message: botResponse,
        timestamp: new Date().toISOString(),
        isAuthenticated,
        conversationId: convoDoc._id.toString(),
      },
    };

    if (req.crisisDetected) {
      responseData.data.crisisAlert = {
        detected: true,
        reason: req.crisisReason,
        message:
          "⚠️ I'm concerned about what you've shared. Please reach out to a professional or crisis helpline if needed.",
      };
    }

    return res.json(responseData);
  } catch (error) {
    console.error("❌ Chatbot controller error:", error);
    return res.status(500).json({
      success: false,
      error:
        "I apologize, but I'm having technical difficulties right now. Please try again in a moment.",
    });
  }
}

// Clear conversation
async function clearConversation(req, res) {
  try {
    const userId =
      (req.user && req.user._id.toString()) ||
      `anon_${req.ip.replace(/[^a-zA-Z0-9]/g, "_")}`;

    conversations.delete(userId);
    await Conversation.deleteOne({ user: req.user?._id });

    return res.json({ success: true, message: "Conversation cleared." });
  } catch (error) {
    console.error("❌ Failed to clear conversation:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to clear conversation" });
  }
}

// Get conversation history
async function getConversationHistory(req, res) {
  try {
    const convoDoc = await Conversation.findOne({ user: req.user?._id });
    return res.json({
      success: true,
      history: convoDoc ? convoDoc.messages : [],
    });
  } catch (error) {
    console.error("❌ Failed to get conversation history:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to get conversation history" });
  }
}

module.exports = {
  chatWithBot,
  clearConversation,
  getConversationHistory,
};
