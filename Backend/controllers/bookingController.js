// controllers/bookingController.js
const Booking = require("../models/Booking");
const User = require("../models/User");

// Create a new booking request (student)
const createBooking = async (req, res, next) => {
  try {
    const { counselorId, datetime, notes } = req.body;

    // Verify counselor exists and has correct role
    const counselor = await User.findOne({
      _id: counselorId,
      role: "counselor",
    });
    if (!counselor) {
      return res.status(400).json({ message: "Invalid counselor selected" });
    }

    // Create the booking
    const booking = new Booking({
      student: req.user._id,
      counselor: counselorId,
      datetime,
      notes,
    });

    await booking.save();

    // Populate the counselor and student data before returning
    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "name email")
      .populate("counselor", "name email");

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    next(error);
  }
};

// Get bookings for logged-in user (student or counselor)
const getMyBookings = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "counselor"
        ? { counselor: req.user._id }
        : { student: req.user._id };

    const bookings = await Booking.find(filter)
      .populate("student", "name email")
      .populate("counselor", "name email")
      .sort({ datetime: 1 });

    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    next(error);
  }
};

// Update booking status (Confirmed, Completed by counselor; Cancelled by either)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Authorization checks
    if (
      (status === "Confirmed" || status === "Completed") &&
      req.user._id.toString() !== booking.counselor.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Only counselor can confirm or complete" });
    }

    if (
      status === "Cancelled" &&
      req.user._id.toString() !== booking.student.toString() &&
      req.user._id.toString() !== booking.counselor.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to cancel" });
    }

    // Update status
    booking.status = status;
    await booking.save();

    // Return populated booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "name email")
      .populate("counselor", "name email");

    res.json(populatedBooking);
  } catch (error) {
    console.error("Update booking status error:", error);
    next(error);
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find()
      .populate("student", "name email")
      .populate("counselor", "name email")
      .sort({ datetime: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await Booking.countDocuments();
    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getAllBookings,
};
