const express = require("express");
const Conversation = require("../models/Conversation");
const adminAuth = require("../middleware/authAdmin");
const Screening = require("../models/Screening");

const router = express.Router();

// List all crisis-flagged conversations (admin only)
router.get("/crises", adminAuth, async (req, res) => {
  try {
    const crises = await Conversation.find({ crisisAlert: true })
      .populate("user", "name email")
      .sort({ updatedAt: -1 });
    res.json(crises);
  } catch (error) {
    console.error("Error fetching crisis alerts:", error);
    res.status(500).json({ message: "Server error retrieving crisis alerts" });
  }
});

router.get("/screening-alerts", adminAuth, async (req, res) => {
  try {
    const highRiskScreenings = await Screening.find({ riskLevel: "High" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, screenings: highRiskScreenings });
  } catch (error) {
    console.error("Error fetching high-risk screenings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
