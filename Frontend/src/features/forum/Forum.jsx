import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await api.get("/api/forum");
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    setLoading(true);
    try {
      const { data } = await api.post("/api/forum", newPost);
      setPosts((prev) => [data, ...prev]);
      setNewPost({ title: "", content: "" });
      setShowCreateForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await api.post(`/api/forum/${postId}/like`);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? data : post))
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/api/forum/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🌱 Anonymous Forum</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium cursor-pointer hover:bg-blue-700 transition"
        >
          {showCreateForm ? "Cancel" : "New Post"}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-5 rounded-xl shadow border mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Create a Post
          </h3>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="What's on your mind?"
              rows={3}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-md bg-green-600 cursor-pointer text-white font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-5">
        {posts.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-md border">
            <p className="text-gray-500">No posts yet. Be the first to share!</p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLike}
            onDelete={handleDeletePost}
            onUpdate={(updatedPost) =>
              setPosts((prev) =>
                prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------- PostCard Component -------------------------- */
function PostCard({ post, onLike, onDelete, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.post(`/api/forum/${post._id}/comment`, {
        text: newComment,
      });
      onUpdate(data);
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const { data } = await api.delete(
        `/api/forum/${post._id}/comment/${commentId}`
      );
      onUpdate(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      {/* Post Header */}
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold text-xl text-gray-900">{post.title}</h3>
        {post.canDelete && (
          <button
            className="text-red-500 cursor-pointer text-sm hover:underline"
            onClick={() => onDelete(post._id)}
          >
            Delete
          </button>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-700 text-md mb-3 leading-relaxed">{post.body}</p>

      {/* Post Meta */}
      <div className="flex gap-3 text-xs text-gray-500 mb-3">
        <span>👤 Anonymous</span>
        <span>•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Post Actions */}
      <div className="flex gap-4 text-sm mb-3">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition ${
            post.isLikedByCurrentUser
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          👍 {post.likesCount}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer transition-transform duration-300`}
        >
          💬 {post.commentsCount}
        </button>
      </div>

      {/* Comments Section with Animation */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showComments ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t pt-3 space-y-3">
          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 rounded-md bg-blue-600 cursor-pointer text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-2">
            {post.comments?.length === 0 && (
              <p className="text-gray-400 text-sm text-center">
                No comments yet
              </p>
            )}

            {post.comments?.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between transition-all duration-300 hover:shadow-sm"
              >
                <div>
                  <p className="text-gray-800 text-md mb-1">{comment.text}</p>
                  <span className="text-xs text-gray-500">
                    👤 Anonymous •{" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {comment.canDelete && (
                  <button
                    className="text-red-500 cursor-pointer text-xs hover:underline"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
