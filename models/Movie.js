const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    director: {
      type: String,
      required: [true, "Director is required"],
    },
    production_company: {
      type: String,
      required: [true, "Production company is required"],
    },
    distribution_company: {
      type: String,
      required: [true, "Distribution company is required"],
    },
    US_release_date: {
      type: Date,
      required: [true, "US release date is required"],
    },
    running_time: {
      type: String,
      required: [true, "Running time is required"],
    },
    audience_rating: {
      type: String,
      required: [true, "Audience rating is required"],
    },
  },
  { versionKey: false }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
