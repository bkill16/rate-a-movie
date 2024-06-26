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
      return res.status(404).json({ message: "Actor not found " });
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
      return res.status(404).json({ message: "Actor not found " });
    }

    res.status(200).json(actor);
  } catch (err) {
    res.status(500).json({ message: `Error fetching actor: ${err.message} ` });
  }
}

// getActorByMovie

module.exports = {
  getAllActors,
  getActorById,
  getActorByName
};
