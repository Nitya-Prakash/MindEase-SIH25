const Feedback = require("../models/Feedback");

// Submit anonymous feedback (no user info saved)
const submitFeedback = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Feedback content is required" });

    const feedback = new Feedback({ content });
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all feedbacks
const getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

// Admin: Respond to feedback
const respondToFeedback = async (req, res, next) => {
  try {
    const { response } = req.body;
    if (!response)
      return res.status(400).json({ message: "Response text is required" });

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });

    feedback.response = response;
    feedback.responded = true;
    await feedback.save();

    res.json({ message: "Feedback responded successfully", feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getFeedbacks, respondToFeedback };
