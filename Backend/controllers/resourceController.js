const Resource = require("../models/Resource");

// @route   POST /api/resources
// @desc    Create resource with URL link
// @access  Private (admins or authorized users)
const uploadResource = async (req, res, next) => {
  try {
    const { title, description, fileUrl, category, tags } = req.body;

    if (!title || !fileUrl) {
      return res
        .status(400)
        .json({ message: "Title and fileUrl are required" });
    }

    // Optional: Add URL validation here if needed

    const resource = new Resource({
      title,
      description,
      fileUrl,
      uploadedBy: req.user._id,
      category: category || "General",
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    });

    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public
const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find()
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/resources/:id
// @desc    Delete resource by ID (admin only)
// @access  Private
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await resource.deleteOne();

    res.json({ message: "Resource deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadResource, getResources, deleteResource };
