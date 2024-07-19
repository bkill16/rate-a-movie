const router = require("express").Router();
const actorsController = require("../controllers/actors");
const { objectIdValidationRules, validateObjectId } = require("../util/validation/objectIdValidator");
const { actorValidationRules, validateActor } = require("../util/validation/actorValidator");
const { requiresAuth } = require('express-openid-connect');

router.get("/name/:name", actorsController.getActorByName);
router.get("/movie/:title", actorsController.getCastByMovieTitle);

router.get("/", actorsController.getAllActors);
router.post("/", requiresAuth(), actorValidationRules, validateActor, actorsController.createActor);

router.get("/:id", objectIdValidationRules, validateObjectId, actorsController.getActorById);
router.put("/:id", requiresAuth(), objectIdValidationRules, validateObjectId, actorValidationRules, validateActor, actorsController.updateActor);
router.delete("/:id", requiresAuth(), objectIdValidationRules, validateObjectId, actorsController.deleteActor);

module.exports = router;