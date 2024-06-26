const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema ({
    name: String,
    gender: String,
    dob: Date,
    dod: Date,
    nationality: String
}, { versionKey: false});

const Actor = mongoose.model("Actor", actorSchema);

module.exports = Actor;