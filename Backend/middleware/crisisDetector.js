const Screening = require("../models/Screening");

const crisisKeywords = [
  "suicide",
  "kill myself",
  "self-harm",
  "harm myself",
  "hurt myself",
  "end my life",
  "don't want to live",
  "better off dead",
  "worthless",
  "hopeless",
  "can't go on",
  "want to die",
  "kill me",
  "end it all",
];

const crisisDetector = async (req, res, next) => {
  try {
    req.crisisDetected = false;
    req.crisisReason = null;

    // Check authenticated user's screening history
    if (req.user?._id) {
      const latestScreening = await Screening.findOne({
        user: req.user._id,
      }).sort({ createdAt: -1 });

      if (latestScreening && latestScreening.riskLevel === "High") {
        req.crisisDetected = true;
        req.crisisReason = `High risk screening score (${latestScreening.score})`;
        console.log("Crisis detected from screening:", req.crisisReason);
      }
    }

    // Check message content for crisis keywords
    if (req.body?.message) {
      const message = req.body.message.toLowerCase().trim();

      for (const keyword of crisisKeywords) {
        if (message.includes(keyword)) {
          req.crisisDetected = true;
          req.crisisReason = `Crisis keyword detected: "${keyword}"`;
          console.log("Crisis keyword detected:", keyword);
          break;
        }
      }
    }

    next();
  } catch (error) {
    console.error("Crisis detector error:", error);
    next(); // Continue even if crisis detection fails
  }
};

module.exports = crisisDetector;
