const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

// const frontend = (req, res) => {
//     jsonfile = require("../user.json");
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.json(jsonfile);
//   };

const getAllMovies = async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db();
      const collection = db.collection("movies");
      const data = collection.find();
      const result = await data.toArray();
      res.json(result);
    } catch {
      res.status(500).json(response.error || "Some error occurred while getting all movies.");
    }
};

const getSingleMovie = async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      console.log(req.params.id);
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid movie id to get a movie.');
      }
      const movieId = new ObjectId(req.params.id);
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db();
      const collection = db.collection("movies");
      const data = collection.find({_id: movieId});
      const result = await data.toArray();
      res.json(result);
    } catch {
      res.status(500).json(response.error || "Some error occurred while getting a single movie.");
    }
};

const getSingleMovieByActorId = async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      console.log(req.params.id);
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid actor id to get a movie.');
      }
      const actorId = new ObjectId(req.params.id);
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db();
      const collection = db.collection("movies");
      const data = collection.find({_id: actorId});
      const result = await data.toArray();
      res.json(result);
    } catch {
      res.status(500).json(response.error || "Some error occurred while getting a single movie by actor ID.");
    }
};

const createMovie = async (req, res) => {
    try {
      const movie = {
        title: req.body.title,
        director: req.body.director,
        production_company: req.body.production_company,
        distribution_company: req.body.distribution_company,
        US_release_date: req.body.US_release_date,
        running_time: req.body.running_time,
        audience_rating: req.body.audience_rating
      };
      const mongodb = new MongoClient(process.env.MONGODB_URI);
      await mongodb.connect();
      const response = await mongodb.db().collection("movies").insertOne(movie);
      console.log(response);
    } catch {
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json(response.error || "Some error occurred while creating the movie.");
      }
    }
};

const updateMovie = async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid movie id to update a movie.');
      }  
      const movieId = new ObjectId(req.params.id);
      const movie = {
        title: req.body.title,
        director: req.body.director,
        production_company: req.body.production_company,
        distribution_company: req.body.distribution_company,
        US_release_date: req.body.US_release_date,
        running_time: req.body.running_time,
        audience_rating: req.body.audience_rating
      };
      const mongodb = new MongoClient(process.env.MONGODB_URI);
      await mongodb.connect();
      const response = await mongodb.db().collection("movies").replaceOne({_id: movieId}, movie);
      console.log(response);
    } catch {
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json(response.error || "Some error occurred while updating the movie.");
      }
    }
};

const deleteMovie = async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid movie id to delete a movie.');
      }  
      const movieId = new ObjectId(req.params.id);
      const mongodb = new MongoClient(process.env.MONGODB_URI);
      await mongodb.connect();
      const response = await mongodb.db().collection("movies").deleteOne({_id: movieId});
      console.log(response);
    } catch {
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json(response.error || "Some error occurred while deleting the movie.");
      }
    }
};

module.exports = {
    // frontend, 
    getAllMovies, 
    getSingleMovie,
    getSingleMovieByActorId,
    createMovie,
    updateMovie,
    deleteMovie
};