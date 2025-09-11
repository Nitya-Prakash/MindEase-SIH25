// controllers/adminController.js
const User = require("../models/User");
const Screening = require("../models/Screening");
const Booking = require("../models/Booking");
const ForumPost = require("../models/ForumPost");

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    // Ensure user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userCount = await User.countDocuments();
    const counselorCount = await User.countDocuments({ role: "counselor" });
    const studentCount = await User.countDocuments({ role: "student" });
    const screeningsCount = await Screening.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const forumPostsCount = await ForumPost.countDocuments();

    const recentScreenings = await Screening.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");
    const recentBookings = await Booking.find()
      .sort({ datetime: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("counselor", "name email");
    const recentForumPosts = await ForumPost.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({
      userCount,
      counselorCount,
      studentCount,
      screeningsCount,
      bookingsCount,
      forumPostsCount,
      recentScreenings,
      recentBookings,
      recentForumPosts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
