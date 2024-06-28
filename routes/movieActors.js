const router = require("express").Router();
const maController = require("../controllers/movieActors");

router.get("/", maController.getAllRelationships);
router.post("/", maController.createRelationship);
router.put("/:id", maController.updateRelationship);
router.delete("/:id", maController.deleteRelationship);

module.exports = router;
