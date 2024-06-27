const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');

// Route to get all reviews
// http://localhost:8080/reviews
router.get('/', reviewsController.getAllReviews);

// Route to get a single review by review ID
// http://localhost:8080/reviews/reviewId
router.get('/review/:reviewId', reviewsController.getSingleReview);

// Route to get reviews by user ID
// http://localhost:8080/reviews/user/userId
router.get('/user/:userId', reviewsController.getReviewsByUserId);

// Route to get reviews by movie ID
// http://localhost:8080/reviews/movie/movieId
router.get('/movie/:movieId', reviewsController.getReviewsByMovieId);

// Route to create a new review
// http://localhost:8080/reviews
router.post('/', reviewsController.createNewReview);

// Route to update a review by review ID
// http://localhost:8080/reviews/reviewId
router.put('/update/:reviewId', reviewsController.updateReview);

// Route to delete a review by review ID
// http://localhost:8080/reviews/reviewId
router.delete('/delete/:reviewId', reviewsController.deleteReview);

module.exports = router;
