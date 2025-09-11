// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, email, password, role, phone, age, gender } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create new user with all fields
    user = new User({
      name,
      email,
      password,
      role: role || "student",
      phone: phone || undefined, // Add phone
      age: age ? parseInt(age) : undefined, // Add age (convert to number)
      gender: gender || undefined, // Add gender
    });

    await user.save();

    const token = generateToken(user._id);

    // Return success response with complete user data
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
