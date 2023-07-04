const Review = require("../models/review.model");

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate("user").exec();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, body } = req.body;
    const { _id } = req.user;
    const review = await Review.create({ user: _id, rating, body });
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllReviews, createReview };
