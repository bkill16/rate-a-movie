const router = require("express").Router();
const actorsController = require("../controllers/actors");
const { objectIdValidationRules, validateObjectId } = require("../validation/objectIdValidator");
const { actorValidationRules, validateActor } = require("../validation/actorValidator");

router.get("/name/:name", actorsController.getActorByName);
router.get("/movie/:title", actorsController.getCastByMovieTitle);

router.get("/", actorsController.getAllActors);
router.post("/", actorValidationRules, validateActor, actorsController.createActor);

router.get("/:id", objectIdValidationRules, validateObjectId, actorsController.getActorById);
router.put("/:id", objectIdValidationRules, validateObjectId, actorValidationRules, validateActor, actorsController.updateActor);
router.delete("/:id", objectIdValidationRules, validateObjectId, actorsController.deleteActor);

module.exports = router;