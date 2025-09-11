// controllers/screeningController.js
const Screening = require("../models/Screening");
const { sendEmail } = require("../utils/notification");

// Helper to calculate risk level
const getRiskLevel = (score, type) => {
  if (type === "PHQ-9") {
    if (score >= 20) return "High";
    if (score >= 10) return "Moderate";
    return "Low";
  }
  // ... GAD-7, GHQ-12 same as before
  return "Low";
};

const submitScreening = async (req, res, next) => {
  const { type, responses } = req.body;
  try {
    const score = responses.reduce((sum, r) => sum + r.answer, 0);
    const riskLevel = getRiskLevel(score, type);
    const screening = new Screening({
      user: req.user._id,
      type,
      responses,
      score,
      riskLevel,
    });
    await screening.save();

    // Notify admin if high risk
    if (riskLevel === "High" && process.env.ADMIN_EMAIL) {
      const subject = "🚨 High‐Risk Screening Alert";
      const message = `
        User: ${req.user.name} (${req.user.email})
        Screening: ${type}
        Score: ${score}
        Risk: High
      `;
      sendEmail(process.env.ADMIN_EMAIL, subject, message).catch((err) =>
        console.error("Email error:", err)
      );
    }

    res.status(201).json({
      success: true,
      screening: { type, score, riskLevel, createdAt: screening.createdAt },
    });
  } catch (err) {
    next(err);
  }
};

const getUserScreenings = async (req, res, next) => {
  try {
    const screenings = await Screening.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("type score riskLevel createdAt");
    res.json({ success: true, screenings });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitScreening, getUserScreenings };
