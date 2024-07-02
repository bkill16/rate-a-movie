const router = require("express").Router();
const maController = require("../controllers/movieActors");
const { objectIdValidationRules, validateObjectId } = require("../validation/objectIdValidator");
const { maValidationRules, validateMA } = require("../validation/movieActorValidator")

router.get("/", maController.getAllRelationships);
router.post("/", maValidationRules, validateMA, maController.createRelationship);
router.put("/:id", objectIdValidationRules, validateObjectId, maValidationRules, validateMA, maController.updateRelationship);
router.delete("/:id", objectIdValidationRules, validateObjectId, maController.deleteRelationship);

module.exports = router;
