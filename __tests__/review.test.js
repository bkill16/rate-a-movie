// npm install --save-dev jest supertest
// to run the tests 'npm test'

const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;
const Review = require("../models/Reviews");
const Movie = require("../models/Movie");
const startServer = require("../server");

let app;

beforeAll(async () => {
  app = await startServer();
  await mongoose.connect(MONGODB_TEST_URI);
  server = app.listen(8081);
});

afterEach(async () => {
  await Review.deleteMany({});
  await Movie.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
  await mongoose.disconnect();
  await new Promise((resolve) => setTimeout(resolve, 500));
});

describe("Rate a Movie API - Reviews", () => {
  it("should get all reviews", async () => {
    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "2010-07-16T00:00:00.000Z",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const review1 = new Review({
      movie_id: movie._id,
      rating: 5,
      comment: "Excellent movie!",
    });
    const review2 = new Review({
      movie_id: movie._id,
      rating: 4,
      comment: "Great movie!",
    });
    await review1.save();
    await review2.save();

    const response = await request(app).get("/reviews");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("should create a new review", async () => {
    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "2010-07-16T00:00:00.000Z",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const response = await request(app).post("/reviews").send({
      movie_id: movie._id,
      rating: 5,
      comment: "Excellent movie!",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.rating).toBe(5);
    expect(response.body.comment).toBe("Excellent movie!");
  });

  it("should update a review by ID", async () => {
    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "2010-07-16T00:00:00.000Z",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();
  
    const review = new Review({
      movie_id: movie._id,
      rating: 4,
      comment: "Great movie!",
    });
    await review.save();
  
    const response = await request(app)
      .put(`/reviews/${review._id}`)
      .send({
        movie_id: movie._id,
        rating: 5,
        comment: "Amazing movie!",
      });
  
    expect(response.statusCode).toBe(200);
    expect(response.body.rating).toBe(5);
    expect(response.body.comment).toBe("Amazing movie!");
  });

  it("should delete a review by ID", async () => {
    const movie = new Movie({
      title: "Inception",
      director: "Christopher Nolan",
      production_company: "Warner Bros.",
      distribution_company: "Warner Bros.",
      US_release_date: "2010-07-16T00:00:00.000Z",
      running_time: "148 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const review = new Review({
      movie_id: movie._id,
      rating: 4,
      comment: "Great movie!",
    });
    await review.save();

    const response = await request(app).delete(`/reviews/${review._id}`);

    expect(response.statusCode).toBe(204);
});

  it("should return a 404 for a non-existent review on get", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/reviews/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent review on delete", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/reviews/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
});
});
