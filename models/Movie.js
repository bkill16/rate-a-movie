const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    production_company: {
      type: String,
      required: true,
    },
    distribution_company: {
      type: String,
      required: true,
    },
    US_release_date: {
      type: Date,
      required: true,
    },
    running_time: {
      type: Number,
      required: true,
    },
    audience_rating: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
