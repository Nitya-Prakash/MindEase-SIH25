const ForumPost = require("../models/ForumPost");

// ✅ Utility: sanitize comments with ownership info
const sanitizeComments = (comments, currentUserId, postOwnerId) => {
  if (!Array.isArray(comments)) return [];

  return comments.map((c) => {
    const obj = typeof c.toObject === "function" ? c.toObject() : c;
    return {
      _id: obj._id,
      text: obj.text,
      createdAt: obj.createdAt,
      user: null, // Always anonymous
      // User can delete their own comment OR post owner can delete any comment
      canDelete:
        currentUserId &&
        (obj.user?.toString() === currentUserId.toString() ||
          postOwnerId?.toString() === currentUserId.toString()),
    };
  });
};

// ✅ Utility: sanitize post with ownership info
const sanitizePost = (post, currentUserId = null) => {
  const obj = typeof post.toObject === "function" ? post.toObject() : post;
  const isOwner =
    currentUserId && obj.user?.toString() === currentUserId.toString();

  return {
    _id: obj._id,
    title: obj.title,
    body: obj.body,
    tags: obj.tags || [],
    likes: obj.likes || [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    user: null, // Always anonymous
    comments: sanitizeComments(obj.comments || [], currentUserId, obj.user),
    // Only show ownership to the actual owner
    canEdit: isOwner,
    canDelete: isOwner,
    likesCount: (obj.likes || []).length,
    commentsCount: (obj.comments || []).length,
    isLikedByCurrentUser: currentUserId
      ? (obj.likes || []).includes(currentUserId.toString())
      : false,
  };
};

// ------------------ Controllers ------------------ //

// Get all posts
const getAllPosts = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id;
    const posts = await ForumPost.find().sort({ createdAt: -1 });

    const sanitizedPosts = posts.map((post) =>
      sanitizePost(post, currentUserId)
    );
    res.json(sanitizedPosts);
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    next(err);
  }
};

// Get single post by ID
const getPostById = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id;
    console.log("🔍 getPostById - Current user:", currentUserId?.toString());

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const sanitized = sanitizePost(post, currentUserId);
    console.log(
      `📄 Post ${post._id}: owner=${post.user?.toString()}, canDelete=${
        sanitized.canDelete
      }`
    );

    res.json(sanitized);
  } catch (err) {
    console.error("Error in getPostById:", err);
    next(err);
  }
};

// Create post
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    const post = new ForumPost({
      user: req.user._id,
      title,
      body: content,
      tags: tags || [],
      comments: [],
      likes: [],
    });

    await post.save();
    res.status(201).json(sanitizePost(post, req.user._id));
  } catch (err) {
    console.error("Error in createPost:", err);
    next(err);
  }
};

// Update post (only by owner)
const updatePost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own posts" });
    }

    if (title) post.title = title;
    if (content) post.body = content;
    if (tags) post.tags = tags;

    await post.save();
    res.json(sanitizePost(post, req.user._id));
  } catch (err) {
    console.error("Error in updatePost:", err);
    next(err);
  }
};

// Delete post (only by owner)
const deletePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error in deletePost:", err);
    next(err);
  }
};

// Add comment
const addComment = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.json(sanitizePost(post, req.user._id));
  } catch (err) {
    console.error("Error in addComment:", err);
    next(err);
  }
};

// Delete comment (by comment owner OR post owner)
const deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const post = await ForumPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const currentUserId = req.user._id.toString();
    const commentOwnerId = comment.user?.toString();
    const postOwnerId = post.user.toString();

    // Allow deletion if user owns the comment OR owns the post
    const canDelete =
      commentOwnerId === currentUserId || postOwnerId === currentUserId;

    if (!canDelete) {
      return res.status(403).json({
        message:
          "You can only delete your own comments or comments on your posts",
      });
    }

    // Remove the comment
    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    res.json(sanitizePost(post, req.user._id));
  } catch (err) {
    console.error("Error in deleteComment:", err);
    next(err);
  }
};

// Toggle like
const toggleLike = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    const userId = req.user._id.toString();
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json(sanitizePost(post, req.user._id));
  } catch (err) {
    console.error("Error in toggleLike:", err);
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  toggleLike,
};
