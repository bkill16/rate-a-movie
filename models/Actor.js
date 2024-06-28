const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    dod: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Actor = mongoose.model("Actor", actorSchema);

module.exports = Actor;
