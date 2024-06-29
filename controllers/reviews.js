const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const getAllReviews = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db();
        const collection = db.collection("reviews");
        const data = collection.find();
        const result = await data.toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json(error.message || "Some error occurred while getting all reviews.");
    }
};

const getSingleReview = async (req, res) => {
    let client;
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json('Must use a valid review id to get a review.');
        }
        
        const reviewId = new ObjectId(req.params.id);
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        const db = client.db();
        const collection = db.collection("reviews");
        const result = await collection.findOne({ _id: reviewId });

        if (!result) {
            return res.status(404).json('Review not found');
        }

        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (error) {
        res.status(500).json(error.message || "Some error occurred while getting a single review.");
    } finally {
        if (client) {
            await client.close();
        }
    }
};

// needs to be reviewd to match user oject once the collection is created

const getReviewsByUserId = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json('Must use a valid user id to get reviews.');
        }
        const userId = new ObjectId(req.params.id);
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db();
        const collection = db.collection("reviews");
        const data = collection.find({ user_id: userId });
        const result = await data.toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json(error.message || "Some error occurred while getting reviews by user ID.");
    }
};

const getReviewsByMovieId = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json('Must use a valid movie id to get reviews.');
        }
        const movieId = new ObjectId(req.params.id);
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db();
        const collection = db.collection("reviews");
        const data = collection.find({ movie_id: movieId });
        const result = await data.toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json(error.message || "Some error occurred while getting reviews by movie ID.");
    }
};

const createNewReview = async (req, res) => {
    try {
        const review = {
            user_id: new ObjectId(req.body.user_id),
            movie_id: new ObjectId(req.body.movie_id),
            rating: req.body.rating,
            comment: req.body.comment,
            date: new Date()
        };
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const response = await client.db().collection("reviews").insertOne(review);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json("Some error occurred while creating the review.");
        }
        client.close();
    } catch (error) {
        res.status(500).json(error.message || "Some error occurred while creating the review.");
    }
};

const updateReview = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json('Must use a valid review id to update a review.');
        }
        const reviewId = new ObjectId(req.params.id);
        const review = {
            user_id: new ObjectId(req.body.user_id),
            movie_id: new ObjectId(req.body.movie_id),
            rating: req.body.rating,
            comment: req.body.comment,
            date: new Date()
        };
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const response = await client.db().collection("reviews").replaceOne({ _id: reviewId }, review);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json("Some error occurred while updating the review.");
        }
        client.close();
    } catch (error) {
        res.status(500).json(error.message || "Some error occurred while updating the review.");
    }
};

const deleteReview = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json('Must use a valid review id to delete a review.');
        }
        const reviewId = new ObjectId(req.params.id);
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const response = await client.db().collection("reviews").deleteOne({ _id: reviewId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json("Some error occurred while deleting the review.");
        }
        client.close();
    } catch (error) {
        res.status(500).json(error.message || "Some error occurred while deleting the review.");
    }
};

module.exports = {
    getAllReviews,
    getSingleReview,
    getReviewsByUserId,
    getReviewsByMovieId,
    createNewReview,
    updateReview,
    deleteReview
};
