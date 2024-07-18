// npm install --save-dev jest supertest
// to run the tests 'npm test'

const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;
const Movie = require("../models/Movie");
const Actor = require("../models/Actor");
const MovieActor = require("../models/MovieActor");
const startServer = require("../server");

let app;
let server;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  app = await startServer();
  await mongoose.connect(MONGODB_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  server = app.listen(8083);
});

afterEach(async () => {
  await Actor.deleteMany({});
  await Movie.deleteMany({});
  await MovieActor.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
  await mongoose.disconnect();
  await new Promise((resolve) => setTimeout(resolve, 500));
});

describe("Rate a Movie API - Movies", () => {
  it("should get all movies", async () => {
    const movie1 = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "July 16, 2010",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    const movie2 = new Movie({
      title: "The Dark Knight",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "July 18, 2010",
      running_time: "152 minutes",
      audience_rating: "PG-13",
    });
    await movie1.save();
    await movie2.save();

    const response = await request(app).get("/movies");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("should get a single movie by ID", async () => {
    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "July 16, 2010",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const response = await request(app).get(`/movies/${movie._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Inception");
  });

  it("should create a new movie", async () => {
    const response = await request(app).post("/movies").send({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "July 16, 2010",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.savedMovie.title).toBe("Inception");
  });

  it("should update a movie by ID", async () => {
    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "July 16, 2010",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const response = await request(app)
      .put(`/movies/${movie._id}`)
      .send({
        title: "Inception - Updated",
        director: "Christopher Nolan",
        production_company: "Warner Bros.",
        distribution_company: "Warner Bros.",
        US_release_date: "July 16, 2010",
        running_time: "148 minutes",
        audience_rating: "PG-13",
      });

    expect(response.statusCode).toBe(204);
  });

  it("should delete a movie by ID", async () => {
    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "July 16, 2010",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const response = await request(app).delete(`/movies/${movie._id}`);

    expect(response.statusCode).toBe(204);
  });

  it("should return a 404 for a non-existent movie on get", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/movies/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent movie on delete", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/movies/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
  });

  it("should get a movie by title", async () => {
    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "July 16, 2010",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const response = await request(app).get(`/movies/title/Inception`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0].title).toBe("Inception");
  });

  it("should get movies by actor name", async () => {
    const actor = new Actor({ 
        name: "Leonardo DiCaprio",
        nationality: "American",
        dob: "1974-11-11",
        gender: "Male" 
    });
    await actor.save();

    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "July 16, 2010",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const movieActor = new MovieActor({
      actorId: actor._id,
      movieId: movie._id,
      role: "Dom Cobb",
    });
    await movieActor.save();

    const response = await request(app).get(`/movies/actor/Leonardo DiCaprio`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0].title).toBe("Inception");
    expect(response.body[0].role).toBe("Dom Cobb");
  });
});