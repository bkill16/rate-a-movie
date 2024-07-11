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
let server;

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
      title: "Star Wars",
      director: "George Lucas",
      production_company: "Lucasfilm",
      distribution_company: "20th Century Fox",
      US_release_date: "1977-05-25",
      running_time: 121,
      audience_rating: "PG",
    });
    await movie.save();

    const review1 = new Review({ movie_id: movie._id, rating: 4, comment: "Great movie!" });
    const review2 = new Review({ movie_id: movie._id, rating: 5, comment: "Excellent!" });
    await review1.save();
    await review2.save();

    const response = await request(app).get("/reviews");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);

    expect(response.body[0].rating).toBe(4);
    expect(response.body[0].comment).toBe("Great movie!");

    expect(response.body[1].rating).toBe(5);
    expect(response.body[1].comment).toBe("Excellent!");
  });

  it("should get a single review by ID", async () => {
    const movie = new Movie({
      title: "Star Wars",
      director: "George Lucas",
      production_company: "Lucasfilm",
      distribution_company: "20th Century Fox",
      US_release_date: "1977-05-25",
      running_time: 121,
      audience_rating: "PG",
    });
    await movie.save();

    const review = new Review({ movie_id: movie._id, rating: 4, comment: "Great movie!" });
    await review.save();

    const response = await request(app).get(`/reviews/${review._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.rating).toBe(4);
    expect(response.body.comment).toBe("Great movie!");
  });

  it("should get reviews by movie title", async () => {
    const movie = new Movie({
      title: "Star Wars",
      director: "George Lucas",
      production_company: "Lucasfilm",
      distribution_company: "20th Century Fox",
      US_release_date: "1977-05-25",
      running_time: 121,
      audience_rating: "PG",
    });
    await movie.save();

    const review = new Review({ movie_id: movie._id, rating: 5, comment: "Amazing!" });
    await review.save();

    const response = await request(app).get(`/reviews/title/${encodeURIComponent(movie.title)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.movie).toBe("Star Wars");
    expect(response.body.reviews.length).toBe(1);
    expect(response.body.reviews[0].comment).toBe("Amazing!");
  });

  it("should create a new review", async () => {
    const movie = new Movie({
      title: "Star Wars",
      director: "George Lucas",
      production_company: "Lucasfilm",
      distribution_company: "20th Century Fox",
      US_release_date: "1977-05-25",
      running_time: 121,
      audience_rating: "PG",
    });
    await movie.save();

    const response = await request(app).post("/reviews").send({
      movie_id: movie._id,
      rating: 5,
      comment: "Excellent!"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.rating).toBe(5);
    expect(response.body.comment).toBe("Excellent!");
  });

  it("should update a review by ID", async () => {
    const movie = new Movie({
      title: "Star Wars",
      director: "George Lucas",
      production_company: "Lucasfilm",
      distribution_company: "20th Century Fox",
      US_release_date: "1977-05-25",
      running_time: 121,
      audience_rating: "PG",
    });
    await movie.save();

    const review = new Review({ movie_id: movie._id, rating: 4, comment: "Good movie" });
    await review.save();

    const response = await request(app).put(`/reviews/${review._id}`).send({
      movie_id: movie._id,
      rating: 5,
      comment: "Great movie!"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.rating).toBe(5);
    expect(response.body.comment).toBe("Great movie!");
  });

  it("should delete a review by ID", async () => {
    const movie = new Movie({
      title: "Star Wars",
      director: "George Lucas",
      production_company: "Lucasfilm",
      distribution_company: "20th Century Fox",
      US_release_date: "1977-05-25",
      running_time: 121,
      audience_rating: "PG",
    });
    await movie.save();

    const review = new Review({ movie_id: movie._id, rating: 3, comment: "Not bad" });
    await review.save();

    const response = await request(app).delete(`/reviews/${review._id}`);

    expect(response.statusCode).toBe(204);
  });

  it("should return a 404 for a non-existent review on get", async () => {
    const response = await request(app).get("/reviews/667ca138ea8a0e7bbff67a14");
    
    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent review on put", async () => {
    const response = await request(app).put("/reviews/667ca138ea8a0e7bbff67a14").send({
      movie_id: "667b1de0f592b5c99c067fc3",
      rating: 4,
      comment: "Updated comment"
    });
    
    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent review on delete", async () => {
    const response = await request(app).delete("/reviews/667b1de0f592b5c99c067fcb");
    
    expect(response.statusCode).toBe(404);
  });
});
