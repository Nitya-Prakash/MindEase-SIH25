// routes/auth.js
const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");
const { validate } = require("../middleware/validation");

const router = express.Router();

// Register route
router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  validate,
  registerUser
);

// Login route
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  validate,
  loginUser
);

module.exports = router;
