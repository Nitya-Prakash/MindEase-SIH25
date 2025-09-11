// middleware/authAdmin.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { secret } = require("../config/jwt");

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user; // add user info to request for further use if needed
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminAuth;
