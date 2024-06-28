const MovieActor = require("../models/MovieActor");

async function getAllRelationships(req, res) {
  try {
    const movieActors = await MovieActor.find();
    res.status(200).json(movieActors);
  } catch (err) {
    res
      .status(500)
      .json({
        message: `Error fetching movie actor relationships: ${err.message}`,
      });
  }
}

async function createRelationship(req, res) {
  const { movieId, actorId, role } = req.body;

  try {
    const newMovieActor = new MovieActor({
      movieId,
      actorId,
      role,
    });

    const savedMovieActor = await newMovieActor.save();
    res
      .status(201)
      .json({
        message: "Movie actor relationship created successfully",
        savedMovieActor,
      });
  } catch (err) {
    res
      .status(400)
      .json({
        message: `Error creating movie actor relationship: ${err.message}`,
      });
  }
}

async function updateRelationship(req, res) {
  try {
    const relationshipId = req.params.id;
    const updateData = req.body;

    const movieActorRelationship = await MovieActor.findById(relationshipId);
    if (!movieActorRelationship) {
      return res
        .status(404)
        .json({ message: "Movie actor relationship not found" });
    }

    const updatedRelationship = await MovieActor.findByIdAndUpdate(
      relationshipId,
      updateData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({
        message: "Movie actor relationship updated successfully",
        updatedRelationship,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        message: `Error updating movie actor relationship: ${err.message}`,
      });
  }
}

async function deleteRelationship(req, res) {
  try {
    const relationshipId = req.params.id;

    const movieActorRelationship = await MovieActor.findById(relationshipId);
    if (!movieActorRelationship) {
      return res
        .status(404)
        .json({ message: "Movie actor relationship not found" });
    }

    const deletedRelationship = await MovieActor.findByIdAndDelete(
      relationshipId
    );
    res
      .status(204)
      .json({ message: "Movie actor relationship deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: `Error deleting movie actor relationship: ${err.message}`,
      });
  }
}

module.exports = {
  getAllRelationships,
  createRelationship,
  updateRelationship,
  deleteRelationship,
};
