// routes/users.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Validation middleware for profile updates
const profileUpdateValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("phone")
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage("Please enter a valid phone number"),
  body("age")
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be between 1 and 120"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
];

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    next(error);
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile (except email & password)
// @access  Private
router.put(
  "/profile",
  auth,
  profileUpdateValidation,
  async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, phone, age, gender } = req.body;

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Track what fields are being updated
      const updatedFields = [];

      // Only update provided fields
      if (name !== undefined && name.trim() !== "") {
        user.name = name.trim();
        updatedFields.push("name");
      }

      if (phone !== undefined) {
        user.phone = phone.trim() || undefined; // Remove empty strings
        updatedFields.push("phone");
      }

      if (age !== undefined) {
        user.age = age === "" || age === null ? undefined : parseInt(age);
        updatedFields.push("age");
      }

      if (gender !== undefined) {
        user.gender = gender || undefined; // Remove empty strings
        updatedFields.push("gender");
      }

      // Validate that at least one field is being updated
      if (updatedFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid fields provided for update",
        });
      }

      await user.save();

      res.json({
        success: true,
        message: `Profile updated successfully. Updated: ${updatedFields.join(
          ", "
        )}`,
        data: user.getPublicProfile(),
      });
    } catch (error) {
      console.error("Profile update error:", error);

      // Handle MongoDB validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      next(error);
    }
  }
);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get("/", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.findActive()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({ isActive: true });
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: users.map((user) => user.getPublicProfile()),
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    next(error);
  }
});

// @route   GET /api/users/counselors
// @desc    Get all counselors
// @access  Public
router.get("/counselors", async (req, res) => {
  try {
    const counselors = await User.find({ role: "counselor" });
    if (!counselors.length) {
      return res.status(404).json({
        success: false,
        message: "No counselors found",
        data: [],
      });
    }
    res.json({ success: true, data: counselors });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private (Admin)
router.get("/stats", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const stats = await User.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          avgProfileCompleteness: { $avg: "$profileCompleteness" },
        },
      },
    ]);

    const totalUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        roleDistribution: stats,
        recentSignups: await User.find({ isActive: true })
          .select("name email role createdAt")
          .sort({ createdAt: -1 })
          .limit(5),
      },
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    next(error);
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private (Admin)
router.put("/:id/status", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("User status update error:", error);
    next(error);
  }
});

module.exports = router;
