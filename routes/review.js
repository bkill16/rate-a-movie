const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { reviewValidationRules, validateReview } = require('../util/validation/review');

// Non-validated routes
router.get('/', reviewsController.getAllReviews);
router.get('/:reviewId', reviewsController.getSingleReview);
router.get('/title/:title', reviewsController.getReviewsByTitle);

// Routes with validation
router.post('/', reviewValidationRules, validateReview, reviewsController.createNewReview);
router.put('/:reviewId', reviewValidationRules, validateReview, reviewsController.updateReview);

router.delete('/:reviewId', reviewsController.deleteReview);

module.exports = router;
