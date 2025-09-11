const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  uploadResource,
  getResources,
  deleteResource,
} = require("../controllers/resourceController");

const router = express.Router();

// Admin role check middleware
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

// POST: create resource with URL input - admin only
router.post(
  "/",
  auth,
  adminOnly,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("fileUrl").notEmpty().withMessage("File URL is required"),
  ],
  validate,
  uploadResource
);

// GET: public list of resources
router.get("/", getResources);

// DELETE: admin only
router.delete("/:id", auth, adminOnly, deleteResource);

module.exports = router;
