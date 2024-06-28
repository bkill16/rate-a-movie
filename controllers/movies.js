// refactored using mongoose

const Movie = require("../models/Movie");
const Actor = require("../models/Actor");
const MovieActor = require("../models/MovieActor");

async function getAllMovies(req, res) {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ message: `Error fetching movies: ${err.message}` });
  }
}

async function getSingleMovie(req, res) {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ message: `Error fetching movie: ${err.message}` });
  }
}

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

async function getMovieByTitle(req, res) {
  try {
    const movieTitle = req.params.title;
    const escapedTitle = escapeRegex(movieTitle);
    const regex = new RegExp(escapedTitle, "i");
    const movie = await Movie.find({ title: regex });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ message: `Error fetching movie: ${err.message}` });
  }
}

async function getMovieByActorName(req, res) {
  try {
    const actorName = req.params.name;
    const actor = await Actor.findOne({ name: new RegExp(actorName, "i") });

    if (!actor) {
      return res.status(404).json({ message: "Actor not found" });
    }

    const movieActorLinks = await MovieActor.find({ actorId: actor._id })
      .populate({
        path: "movieId",
        select: "-roles",
      })
      .lean();

    if (!movieActorLinks.length) {
      return res
        .status(404)
        .json({ message: "No movies found for this actor" });
    }

    const moviesWithRoles = movieActorLinks.map((link) => ({
      ...link.movieId,
      role: link.role,
    }));

    res.status(200).json(moviesWithRoles);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error fetching movies by actor name: ${err.message}` });
  }
}

async function createMovie(req, res) {
  const {
    title,
    director,
    production_company,
    distribution_company,
    US_release_date,
    running_time,
    audience_rating,
  } = req.body;

  try {
    const newMovie = new Movie({
      title,
      director,
      production_company,
      distribution_company,
      US_release_date,
      running_time,
      audience_rating,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json({ message: "Movie created successfully", savedMovie });
  } catch (err) {
    res.status(400).json({ message: `Error creating movie: ${err.message}` });
  }
}

async function updateMovie(req, res) {
  try {
    const movieId = req.params.id;
    const updateData = req.body;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, updateData, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Movie updated successfully", updatedMovie });
  } catch (err) {
    res.status(500).json({ message: `Error updating movie: ${err.message}` });
  }
}

async function deleteMovie(req, res) {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    res
      .status(204)
      .json({ message: "Movie deleted successfully", deletedMovie });
  } catch (err) {
    res.status(500).json({ message: `Error deleting movie: ${err.message}` });
  }
}

module.exports = {
  getAllMovies,
  getSingleMovie,
  getMovieByTitle,
  getMovieByActorName,
  createMovie,
  updateMovie,
  deleteMovie,
};

// const { MongoClient } = require("mongodb");
// const ObjectId = require("mongodb").ObjectId;

// // const frontend = (req, res) => {
// //     jsonfile = require("../user.json");
// //     res.setHeader("Access-Control-Allow-Origin", "*");
// //     res.json(jsonfile);
// //   };

// const getAllMovies = async (req, res) => {
//     try {
//       res.setHeader("Access-Control-Allow-Origin", "*");
//       const client = new MongoClient(process.env.MONGODB_URI);
//       await client.connect();
//       const db = client.db();
//       const collection = db.collection("movies");
//       const data = collection.find();
//       const result = await data.toArray();
//       res.json(result);
//     } catch {
//       res.status(500).json(response.error || "Some error occurred while getting all movies.");
//     }
// };

// const getSingleMovie = async (req, res) => {
//     try {
//       res.setHeader("Access-Control-Allow-Origin", "*");
//       console.log(req.params.id);
//       if (!ObjectId.isValid(req.params.id)) {
//         res.status(400).json('Must use a valid movie id to get a movie.');
//       }
//       const movieId = new ObjectId(req.params.id);
//       const client = new MongoClient(process.env.MONGODB_URI);
//       await client.connect();
//       const db = client.db();
//       const collection = db.collection("movies");
//       const data = collection.find({_id: movieId});
//       const result = await data.toArray();
//       res.json(result);
//     } catch {
//       res.status(500).json(response.error || "Some error occurred while getting a single movie.");
//     }
// };

// const getSingleMovieByActorId = async (req, res) => {
//     try {
//       res.setHeader("Access-Control-Allow-Origin", "*");
//       console.log(req.params.id);
//       if (!ObjectId.isValid(req.params.id)) {
//         res.status(400).json('Must use a valid actor id to get a movie.');
//       }
//       const actorId = new ObjectId(req.params.id);
//       const client = new MongoClient(process.env.MONGODB_URI);
//       await client.connect();
//       const db = client.db();
//       const collection = db.collection("movies");
//       const data = collection.find({_id: actorId});
//       const result = await data.toArray();
//       res.json(result);
//     } catch {
//       res.status(500).json(response.error || "Some error occurred while getting a single movie by actor ID.");
//     }
// };

// const createMovie = async (req, res) => {
//     try {
//       const movie = {
//         title: req.body.title,
//         director: req.body.director,
//         production_company: req.body.production_company,
//         distribution_company: req.body.distribution_company,
//         US_release_date: req.body.US_release_date,
//         running_time: req.body.running_time,
//         audience_rating: req.body.audience_rating
//       };
//       const mongodb = new MongoClient(process.env.MONGODB_URI);
//       await mongodb.connect();
//       const response = await mongodb.db().collection("movies").insertOne(movie);
//       console.log(response);
//     } catch {
//       if (response.acknowledged) {
//         res.status(201).json(response);
//       } else {
//         res.status(500).json(response.error || "Some error occurred while creating the movie.");
//       }
//     }
// };

// const updateMovie = async (req, res) => {
//     try {
//       if (!ObjectId.isValid(req.params.id)) {
//         res.status(400).json('Must use a valid movie id to update a movie.');
//       }
//       const movieId = new ObjectId(req.params.id);
//       const movie = {
//         title: req.body.title,
//         director: req.body.director,
//         production_company: req.body.production_company,
//         distribution_company: req.body.distribution_company,
//         US_release_date: req.body.US_release_date,
//         running_time: req.body.running_time,
//         audience_rating: req.body.audience_rating
//       };
//       const mongodb = new MongoClient(process.env.MONGODB_URI);
//       await mongodb.connect();
//       const response = await mongodb.db().collection("movies").replaceOne({_id: movieId}, movie);
//       console.log(response);
//     } catch {
//       if (response.modifiedCount > 0) {
//         res.status(204).send();
//       } else {
//         res.status(500).json(response.error || "Some error occurred while updating the movie.");
//       }
//     }
// };

// const deleteMovie = async (req, res) => {
//     try {
//       if (!ObjectId.isValid(req.params.id)) {
//         res.status(400).json('Must use a valid movie id to delete a movie.');
//       }
//       const movieId = new ObjectId(req.params.id);
//       const mongodb = new MongoClient(process.env.MONGODB_URI);
//       await mongodb.connect();
//       const response = await mongodb.db().collection("movies").deleteOne({_id: movieId});
//       console.log(response);
//     } catch {
//       if (response.deletedCount > 0) {
//         res.status(204).send();
//       } else {
//         res.status(500).json(response.error || "Some error occurred while deleting the movie.");
//       }
//     }
// };

// module.exports = {
//     // frontend,
//     getAllMovies,
//     getSingleMovie,
//     getSingleMovieByActorId,
//     createMovie,
//     updateMovie,
//     deleteMovie
// };
