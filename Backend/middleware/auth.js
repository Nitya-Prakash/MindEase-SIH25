// middleware/auth.js
const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token verification failed" });
  }
};

module.exports = auth;
