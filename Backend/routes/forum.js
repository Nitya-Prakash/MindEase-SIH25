const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  toggleLike,
  deleteComment,
} = require("../controllers/forumController");

const router = express.Router();

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return auth(req, res, (err) => {
      if (err) {
        console.log("Auth failed in forum, continuing as anonymous user");
        req.user = null;
      }
      next();
    });
  }
  req.user = null;
  next();
};

// Create post (requires auth)
router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  validate,
  createPost
);

// Get all posts (optional auth for ownership detection)
router.get("/", optionalAuth, getAllPosts);

// Get single post by ID (optional auth for ownership detection)
router.get("/:id", optionalAuth, getPostById);

// Update post by ID (owner only)
router.put(
  "/:id",
  auth,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("content")
      .optional()
      .notEmpty()
      .withMessage("Content cannot be empty"),
  ],
  validate,
  updatePost
);

// Delete post by ID (owner only)
router.delete("/:id", auth, deletePost);

// Add comment to post (requires auth)
router.post(
  "/:id/comment",
  auth,
  [body("text").notEmpty().withMessage("Comment text is required")],
  validate,
  addComment
);

// Delete comment by ID (owner only)
router.delete("/:postId/comment/:commentId", auth, deleteComment);

// Like/unlike post (requires auth)
router.post("/:id/like", auth, toggleLike);

module.exports = router;
