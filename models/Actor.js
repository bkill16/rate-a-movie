const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActorSchema = new Schema ({
    name: String,
    gender: String,
    dob: String,
    dod: String,
    nationality: String
})

const Actor = mongoose.model("Actor", ActorSchema);

module.exports = Actor;