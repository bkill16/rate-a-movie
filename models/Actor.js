// actor validation on the actual actor schema

const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Actor name is required"],
      minlength: [2, "Actor name must be at least 2 characters long"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be either 'Male', 'Female', or 'Other'",
      },
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },
    dod: {
      type: Date,
      required: false,
      validate: {
        validator: function (value) {
          return value == null || value <= new Date();
        },
        message:
          "Date of death must be a valid date and cannot be in the future",
      },
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      minlength: [2, "Nationality must be at least 2 characters long"],
      trim: true,
    },
  },
  { versionKey: false }
);

const Actor = mongoose.model("Actor", actorSchema);

module.exports = Actor;
