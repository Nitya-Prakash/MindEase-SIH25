// routes/bookings.js
const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const router = express.Router();

// Student requests a booking
router.post(
  "/",
  auth,
  [
    body("counselorId")
      .notEmpty()
      .withMessage("Counselor ID is required")
      .isMongoId()
      .withMessage("Invalid counselor ID"),
    body("datetime")
      .notEmpty()
      .withMessage("Datetime is required")
      .isISO8601()
      .withMessage("Valid ISO8601 datetime is required"),
    body("notes").optional().isString(),
  ],
  validate,
  createBooking
);

// Get bookings for logged-in user
router.get("/", auth, getMyBookings);

// Update booking status
router.put(
  "/:id/status",
  auth,
  [
    body("status")
      .isIn(["Pending", "Confirmed", "Cancelled", "Completed"])
      .withMessage("Invalid status"),
  ],
  validate,
  updateBookingStatus
);

module.exports = router;
