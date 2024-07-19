const router = require("express").Router();
const maController = require("../controllers/movieActors");
const { objectIdValidationRules, validateObjectId } = require("../util/validation/objectIdValidator");
const { maValidationRules, validateMA } = require("../util/validation/movieActorValidator")
const { requiresAuth } = require('express-openid-connect');

router.get("/", maController.getAllRelationships);
router.post("/", requiresAuth(), maValidationRules, validateMA, maController.createRelationship);
router.put("/:id", requiresAuth(), objectIdValidationRules, validateObjectId, maValidationRules, validateMA, maController.updateRelationship);
router.delete("/:id", requiresAuth(), objectIdValidationRules, validateObjectId, maController.deleteRelationship);

module.exports = router;
