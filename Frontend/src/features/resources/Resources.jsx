import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state for admin inputs
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [description, setDescription] = useState("");

  // Logged in user role
  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : null;
  const isAdmin = role === "admin";

  // Preview modal
  const [previewResource, setPreviewResource] = React.useState(null);

  useEffect(() => {
    api
      .get("/resources")
      .then((res) => setResources(res.data))
      .catch((err) => console.error("Error fetching resources:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!title.trim() || !fileUrl.trim()) {
      setMessage("Title and File URL are required");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/resources", {
        title,
        fileUrl,
        description,
      });
      setResources((prev) => [data, ...prev]);
      setMessage("Resource added successfully!");
      setTitle("");
      setFileUrl("");
      setDescription("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add resource");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    try {
      await api.delete(`/resources/${id}`);
      setResources((prev) => prev.filter((r) => r._id !== id));
      setMessage("Resource deleted successfully.");
      if (previewResource && previewResource._id === id) setPreviewResource(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete resource");
    }
  };

  const openPreview = (resource) => setPreviewResource(resource);
  const closePreview = () => setPreviewResource(null);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Psychoeducational Resources
      </h2>

      {message && (
        <div className="mb-4 p-3 rounded border bg-gray-100 text-sm sm:text-base">
          {message}
        </div>
      )}

      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 border p-4 rounded bg-white shadow-sm"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded text-sm sm:text-base"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="File URL (image, video, or YouTube link)"
            className="w-full p-2 border rounded text-sm sm:text-base"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            rows={4}
            className="w-full p-2 border rounded resize-none text-sm sm:text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
          >
            {loading ? "Adding..." : "Add Resource"}
          </button>
        </form>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No resources available.
          </p>
        ) : (
          resources.map((resource) => (
            <div
              key={resource._id}
              onClick={() => openPreview(resource)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") openPreview(resource);
              }}
              className="bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition flex flex-col"
            >
              {/* Media Preview */}
              {resource.fileUrl.includes("youtube.com") ||
              resource.fileUrl.includes("youtu.be") ? (
                <div className="relative w-full h-48 sm:h-56 rounded-t overflow-hidden">
                  <iframe
                    title={resource.title}
                    src={
                      resource.fileUrl.includes("youtube.com")
                        ? resource.fileUrl.replace("watch?v=", "embed/")
                        : resource.fileUrl.replace("youtu.be/", "youtube.com/embed/")
                    }
                    frameBorder="0"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              ) : resource.fileUrl.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i) ? (
                <video
                  src={resource.fileUrl}
                  className="rounded-t w-full h-48 sm:h-56 object-cover"
                  muted
                />
              ) : (
                <img
                  src={resource.fileUrl}
                  alt={resource.title}
                  className="rounded-t w-full h-48 sm:h-56 object-cover"
                  loading="lazy"
                />
              )}

              {/* Card Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold mb-1 truncate text-sm sm:text-base">
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="text-gray-700 text-xs sm:text-sm mb-2 line-clamp-3">
                    {resource.description}
                  </p>
                )}
                <p className="text-gray-500 text-xs mb-1">
                  Uploaded by: {resource.uploadedBy?.name || "Unknown"}
                </p>
                <p className="text-gray-400 text-xs mb-2">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </p>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(resource._id);
                    }}
                    className="mt-auto w-full bg-red-600 text-white rounded py-2 text-xs sm:text-sm hover:bg-red-700 transition"
                    type="button"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {previewResource && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 px-4"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold">{previewResource.title}</h3>
              <button
                onClick={closePreview}
                aria-label="Close preview"
                className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
                type="button"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              {(previewResource.fileUrl.includes("youtube.com") ||
              previewResource.fileUrl.includes("youtu.be")) ? (
                <div className="w-full aspect-video rounded overflow-hidden mb-4">
                  <iframe
                    title={previewResource.title}
                    src={
                      previewResource.fileUrl.includes("youtube.com")
                        ? previewResource.fileUrl.replace("watch?v=", "embed/")
                        : previewResource.fileUrl.replace("youtu.be/", "youtube.com/embed/")
                    }
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : previewResource.fileUrl.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i) ? (
                <video
                  src={previewResource.fileUrl}
                  controls
                  className="w-full max-h-[60vh] rounded mb-4"
                />
              ) : (
                <img
                  src={previewResource.fileUrl}
                  alt={previewResource.title}
                  className="w-full rounded mb-4"
                />
              )}
              {previewResource.description && (
                <p className="text-gray-800">{previewResource.description}</p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                Uploaded by: {previewResource.uploadedBy?.name || "Unknown"}
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(previewResource.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
