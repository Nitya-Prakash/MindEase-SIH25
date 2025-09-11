const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth"); // Protect admin routes
const { validate } = require("../middleware/validation");
const {
  submitFeedback,
  getFeedbacks,
  respondToFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

// Public route to submit anonymous feedback
router.post(
  "/",
  [body("content").notEmpty().withMessage("Feedback content is required")],
  validate,
  submitFeedback
);

// Admin routes (require auth & role check middleware if implemented)
router.get("/", auth, getFeedbacks);

router.put(
  "/:id/respond",
  auth,
  [body("response").notEmpty().withMessage("Response text is required")],
  validate,
  respondToFeedback
);

module.exports = router;
