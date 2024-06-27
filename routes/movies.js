const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');

// Route to get all movies
// http://localhost:8080/movies
router.get('/movies', moviesController.getAllMovies);

// Route to get a single movie by movie ID
// http://localhost:8080/movies/movieId
router.get('/movies/:movieId', moviesController.getSingleMovie);

// Route to get movies by actor ID
// http://localhost:8080/movies/actor/actorId
router.get('/actor/:actorId', moviesController.getSingleMovieByActorId);

// Route to create a new movie
// http://localhost:8080/movies
router.post('/', moviesController.createMovie);

// Route to update a movie by movie ID
// http://localhost:8080/movies/movieId
router.put('/movies/:movieId', moviesController.updateMovie);

// Route to delete a movie by movie ID
// http://localhost:8080/movies/movieId
router.delete('/movies/:movieId', moviesController.deleteMovie);

module.exports = router;