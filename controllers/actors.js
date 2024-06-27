const Actor = require("../models/Actor");

async function getAllActors(req, res) {
  try {
    const actors = await Actor.find();
    res.status(200).json(actors);
  } catch (err) {
    res.status(500).json({ message: `Error fetching actors: ${err.message}` });
  }
}

async function getActorById(req, res) {
  try {
    const actorId = req.params.id;
    const actor = await Actor.findById(actorId);

    if (!actor) {
      return res.status(404).json({ message: "Actor not found" });
    }

    res.status(200).json(actor);
  } catch (err) {
    res.status(500).json({ message: `Error fetching actor: ${err.message} ` });
  }
}

async function getActorByName(req, res) {
  try {
    const actorName = req.params.name;
    const actor = await Actor.find({ name: new RegExp(actorName, "i") });

    if (!actor) {
      return res.status(404).json({ message: "Actor not found" });
    }

    res.status(200).json(actor);
  } catch (err) {
    res.status(500).json({ message: `Error fetching actor: ${err.message} ` });
  }
}

// getActorByMovie

async function createActor(req, res) {
  const { name, gender, dob, dod, nationality } = req.body;

  try {
    const newActor = new Actor({
      name,
      gender,
      dob: new Date(dob),
      dod: dod ? new Date(dod) : null,
      nationality,
    });

    const savedActor = await newActor.save();
    res.status(201).json({ message: "Actor created successfully", savedActor });
  } catch (err) {
    res.status(400).json({ message: `Error creating actor: ${err.message}` });
  }
}

async function updateActor(req, res) {
  try {
    const actorId = req.params.id;
    const updateData = req.body;

    const actor = await Actor.findById(actorId);
    if (!actor) {
      return res.status(404).json({ message: "Actor not found" });
    }

    const updatedActor = await Actor.findByIdAndUpdate(actorId, updateData, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Actor updated successfully", updatedActor });
  } catch (err) {
    res.status(500).json({ message: `Error updating actor: ${err.message}` });
  }
}

async function deleteActor(req, res) {
  try {
    const actorId = req.params.id;

    const actor = await Actor.findById(actorId);
    if (!actor) {
      return res.status(404).json({ message: "Actor not found" });
    }

    const deletedActor = await Actor.findByIdAndDelete(actorId);
    res.status(204).json({ message: "Actor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: `Error deleting actor: ${err.message}` });
  }
}

module.exports = {
  getAllActors,
  getActorById,
  getActorByName,
  createActor,
  updateActor,
  deleteActor
};
