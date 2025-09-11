// routes/screening.js
const express = require("express");
const { body } = require("express-validator");
const {
  submitScreening,
  getUserScreenings,
} = require("../controllers/screeningController");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const crisisDetector = require("../middleware/crisisDetector");
const { sendEmail } = require("../utils/notification");

const router = express.Router();

// Submit Screening
router.post(
  "/",
  auth,
  [
    body("type")
      .isIn(["PHQ-9", "GAD-7", "GHQ-12"])
      .withMessage("Invalid screening type"),
    body("responses")
      .isArray({ min: 1 })
      .withMessage("Responses must be an array"),
  ],
  validate,
  crisisDetector, // Add the crisis detection middleware here
  async (req, res, next) => {
    if (req.crisisDetected) {
      // Send email notification to admin(s)
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const subject = "Crisis Alert: User requires immediate attention";
        const message = `
        User: ${req.user.name} (${req.user.email})
        Reason: ${req.crisisReason}
        Screening Type: ${req.body.type}
        Please review and reach out as soon as possible.
        `;
        try {
          await sendEmail(adminEmail, subject, message);
        } catch (emailError) {
          console.error("Failed to send crisis alert email:", emailError);
        }
      }
    }
    next();
  },
  submitScreening
);

// Get all screenings for logged-in user
router.get("/", auth, getUserScreenings);

module.exports = router;
