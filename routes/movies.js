const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movies");
const {movieValidationRules, validateMovie} = require('../util/validation/movieValidator');
const { requiresAuth } = require('express-openid-connect');

router.get("/", moviesController.getAllMovies);
router.get("/:id", moviesController.getSingleMovie);
router.get("/title/:title", moviesController.getMovieByTitle);
router.get("/actor/:name", moviesController.getMovieByActorName);

// Routes with validation
router.post("/", requiresAuth(), movieValidationRules, validateMovie, moviesController.createMovie);
router.put("/:id", requiresAuth(), movieValidationRules, validateMovie, moviesController.updateMovie);

router.delete("/:id", requiresAuth(), moviesController.deleteMovie);

module.exports = router;
