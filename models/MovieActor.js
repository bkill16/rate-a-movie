const mongoose = require("mongoose");

const movieActorSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
    role: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const MovieActor = mongoose.model("MovieActor", movieActorSchema);

module.exports = MovieActor;
