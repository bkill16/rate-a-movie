const Review = require('../models/Reviews');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');


const getAllReviews = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while getting all reviews." });
    }
};

const getSingleReview = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
            return res.status(400).json({ message: 'Must use a valid review id to get a review.' });
        }
        
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while getting a single review." });
    }
};

const getReviewsByTitle = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const movieTitle = decodeURIComponent(req.params.title);
        
        // Use a more flexible search
        const movie = await Movie.findOne({ 
            title: { $regex: new RegExp(movieTitle.split(':')[0], 'i') }
        });
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        
        // Then, find reviews associated with this movie's ID
        const reviews = await Review.find({ movie_id: movie._id });
        
        if (reviews.length === 0) {
            return res.status(404).json({ 
                message: 'No reviews found for this movie',
                movieTitle: movie.title  // Include the actual movie title in the response
            });
        }
        
        res.json({
            movie: movie.title,
            reviews: reviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while getting reviews by movie title." });
    }
};



// const getReviewsByUserId = async (req, res) => {
//     try {
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ message: 'Must use a valid user id to get reviews.' });
//         }
//         const reviews = await Review.find({ user_id: req.params.id });
//         res.json(reviews);
//     } catch (error) {
//         res.status(500).json({ message: error.message || "Some error occurred while getting reviews by user ID." });
//     }
// };

const createNewReview = async (req, res) => {
    try {
        const { movie_id, rating, comment } = req.body;

        // Check if movie_id, rating, and comment are present
        if (!movie_id || !rating || !comment) {
            return res.status(400).json({ message: "Movie ID, rating, and comment are required." });
        }

        const review = new Review({
            movie_id: movie_id,
            rating: rating,
            comment: comment
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while creating the review." });
    }
};

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { movie_id, rating, comment } = req.body;

        // Validate reviewId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: 'Invalid review ID.' });
        }

        const updateObj = { movie_id, rating, comment };
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { $set: updateObj },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found for update.' });
        }

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while updating the review." });
    }
};


// const deleteReview = async (req, res) => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ message: 'Must use a valid review id to delete a review.' });
//         }
//         const deletedReview = await Review.findByIdAndDelete(req.params.id);
//         if (!deletedReview) {
//             return res.status(404).json({ message: 'Review not found' });
//         }
//         res.status(204).send();
//     } catch (error) {
//         res.status(500).json({ message: error.message || "Some error occurred while deleting the review." });
//     }
// };

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: 'Must use a valid review id to delete a review.' });
        }
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while deleting the review." });
    }
};

module.exports = {
    getAllReviews,
    getSingleReview,
    // getReviewsByUserId,
    getReviewsByTitle,
    createNewReview,
    updateReview,
    deleteReview
};