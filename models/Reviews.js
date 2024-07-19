const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
    required: [true, "Movie ID is required"]
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"]
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must be at most 5"]
  },
  comment: {
    type: String,
    required: [true, "Comment is required"]
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false }); // Disable __v field in MongoDB documents

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;