const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { reviewValidationRules, validateReview } = require('../util/validation/review');
const { requiresAuth } = require('express-openid-connect');

router.get('/', reviewsController.getAllReviews);
router.get('/:reviewId', reviewsController.getSingleReview);

// Routes with validation
router.post('/', requiresAuth(), reviewValidationRules, validateReview, reviewsController.createNewReview);
router.put('/:reviewId', requiresAuth(), reviewValidationRules, validateReview, reviewsController.updateReview);

// Delete a review by ID
router.delete('/:reviewId', requiresAuth(), reviewsController.deleteReview);

// remove routes due to bugs
// router.get('/title/:title', reviewsController.getReviewsByTitle); 
// router.get('/user/:userId', reviewsController.getReviewsByUserId);

module.exports = router;
