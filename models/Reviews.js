const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;