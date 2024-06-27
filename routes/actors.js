const router = require("express").Router();
const actorsController = require("../controllers/actors");

router.get("/", actorsController.getAllActors);
router.get("/:id", actorsController.getActorById);
router.get("/name/:name", actorsController.getActorByName);
router.post("/", actorsController.createActor);
router.put("/:id", actorsController.updateActor)
router.delete("/:id", actorsController.deleteActor)

module.exports = router;
