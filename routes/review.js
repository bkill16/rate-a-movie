const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');

// Route to get all reviews
// http://localhost:8080/reviews
router.get('/', reviewsController.getAll);

// Route to get a single review by review ID
// http://localhost:8080/reviews/reviewId
router.get('/review/:reviewId', reviewsController.getSingle);

// Route to get reviews by user ID
// http://localhost:8080/reviews/user/userId
router.get('/user/:userId', reviewsController.getByUserId);

// Route to get reviews by movie ID
// http://localhost:8080/reviews/movie/movieId
router.get('/movie/:movieId', reviewsController.getByMovieId);

// Route to create a new review
// http://localhost:8080/reviews
router.post('/', reviewsController.createReview);

// Route to update a review by review ID
// http://localhost:8080/reviews/reviewId
router.put('/review/:reviewId', reviewsController.updateReview);

// Route to delete a review by review ID
// http://localhost:8080/reviews/reviewId
router.delete('/review/:reviewId', reviewsController.deleteReview);

module.exports = router;
