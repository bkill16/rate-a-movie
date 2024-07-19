const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { reviewValidationRules, validateReview } = require('../util/validation/review');

<<<<<<< HEAD
// Non-validated routes
router.get('/', reviewsController.getAllReviews);  // http://localhost:3000/reviews
router.get('/:reviewId', reviewsController.getSingleReview);  // http://localhost:3000/reviews/123456789
router.get('/title/:title', reviewsController.getReviewsByTitle); // http://localhost:3000/reviews/title/Inception
router.get('/user/:userId', reviewsController.getReviewsByUserId); // http://localhost:3000/reviews/user/16543456789

// Routes with validation
router.post('/', reviewValidationRules, validateReview, reviewsController.createNewReview); // http://localhost:3000/reviews
router.put('/:reviewId', reviewValidationRules, validateReview, reviewsController.updateReview); // http://localhost:3000/reviews

// Delete a review by ID
router.delete('/:reviewId', reviewsController.deleteReview); // http://localhost:3000/reviews/123456789 
=======
router.get('/', reviewsController.getAllReviews);
router.get('/:reviewId', reviewsController.getSingleReview);

// Routes with validation
router.post('/', reviewValidationRules, validateReview, reviewsController.createNewReview);
router.put('/:reviewId', reviewValidationRules, validateReview, reviewsController.updateReview);

// Delete a review by ID
router.delete('/:reviewId', reviewsController.deleteReview);


// remove routes due to bugs
// router.get('/title/:title', reviewsController.getReviewsByTitle); 
// router.get('/user/:userId', reviewsController.getReviewsByUserId);
>>>>>>> fd93740c4396dcc0a095a290ac7ba3ee53e676c8

module.exports = router;
