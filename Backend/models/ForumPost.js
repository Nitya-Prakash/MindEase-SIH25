const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Track comment owner
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const forumPostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    comments: { type: [commentSchema], default: [] },
    likes: { type: [String], default: [] }, // Array of user IDs as strings
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForumPost", forumPostSchema);
