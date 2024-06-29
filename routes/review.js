const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');

// Route to get all reviews
// http://localhost:8080/reviews
router.get('/', reviewsController.getAllReviews);

// Route to get a single review by review ID
// http://localhost:8080/reviews/reviewId
router.get('/:reviewId', reviewsController.getSingleReview);

// Route to get reviews by movie title
// http://localhost:8080/reviews/title/Movie%20Title
router.get('/title/:title', reviewsController.getReviewsByTitle);

// Route to create a new review
// http://localhost:8080/reviews
router.post('/', reviewsController.createNewReview);

// Route to update a review by review ID
// http://localhost:8080/reviews/reviewId
router.put('/:reviewId', reviewsController.updateReview);

// Route to delete a review by review ID
// http://localhost:8080/reviews/reviewId
router.delete('/:reviewId', reviewsController.deleteReview);

module.exports = router;