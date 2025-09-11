const express = require("express");
const { body } = require("express-validator");
const {
  chatWithBot,
  clearConversation,
  getConversationHistory,
} = require("../controllers/chatbotController");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const crisisDetector = require("../middleware/crisisDetector");
const { sendEmail } = require("../utils/notification");

const router = express.Router();

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return auth(req, res, (err) => {
      if (err) {
        console.log("Auth failed, continuing as anonymous user");
        req.user = null;
      }
      next();
    });
  }
  req.user = null;
  next();
};

router.post(
  "/chat",
  optionalAuth, // ✅ Optional authentication
  crisisDetector,
  async (req, res, next) => {
    // Handle crisis detection
    if (req.crisisDetected) {
      try {
        console.log("🚨 CRISIS DETECTED:", req.crisisReason);

        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const subject = "🚨 URGENT: Crisis Alert - Mental Health Support";
        const emailMessage = `
CRISIS ALERT DETECTED:

User ID: ${req.user?._id || "Anonymous User"}
Reason: ${req.crisisReason}
Message: "${req.body.message}"
Timestamp: ${new Date().toISOString()}
IP Address: ${req.ip}

Please follow up immediately with appropriate mental health resources.

---
Mental Health Support System
        `;

        await sendEmail(adminEmail, subject, emailMessage);
        console.log("✅ Crisis alert email sent to admin");
      } catch (emailError) {
        console.error(
          "❌ Failed to send crisis alert email:",
          emailError.message
        );
      }
    }
    next();
  },
  [body("message").notEmpty().trim().withMessage("Message is required")],
  validate,
  chatWithBot
);

router.post("/clear", clearConversation);
router.get("/history", getConversationHistory);

module.exports = router;
