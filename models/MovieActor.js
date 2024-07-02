const mongoose = require("mongoose");

const movieActorSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "MovieId is required"],
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: (props) => `${props.value} is not a valid MovieId!`,
      },
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
      required: [true, "ActorId is required"],
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: (props) => `${props.value} is not a valid ActorId!`,
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      minlength: [1, "Role cannot be empty"],
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
  },
  { versionKey: false }
);

const MovieActor = mongoose.model("MovieActor", movieActorSchema);

module.exports = MovieActor;
