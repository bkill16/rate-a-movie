// npm install --save-dev jest supertest
// to run the tests 'npm test'
// or to run a single test, npm test -- __tests__/review.spec.js

const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;
const Review = require("../models/Reviews");
const Movie = require("../models/Movie");
const User = require("../models/User");  // Ensure the User model is required
const startServer = require("../server");

let app;
let server;
let mockUser;  // Declare a variable to store the mock user's object

// Define a mock user object and a function to insert it into the test database
mockUser = {
  _id: new mongoose.Types.ObjectId(),  // Generate a unique ID for the mock user
  auth0Id: 'mock-auth0-id',
  email: 'mockuser@example.com',
  name: 'Mock User'
};

const createMockUser = async () => {
  await new User(mockUser).save();  // Insert the mock user
};

beforeAll(async () => {
    app = await startServer();
    await mongoose.connect(MONGODB_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await createMockUser();  // Create the mock user before the tests
    server = app.listen(8081);
});

afterEach(async () => {
    await Review.deleteMany({});
    await Movie.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});  // Clean up the user collection including the mock user
    await mongoose.connection.close();
    await server.close();
});

it("should create a new review with mock user ID", async () => {
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
      user_id: mockUser._id,  // Use the mock user ID when creating a review
      rating: 5,
      comment: "Excellent movie!"
  });

  expect(response.statusCode).toBe(201);
  expect(response.body.rating).toBe(5);
  expect(response.body.comment).toBe("Excellent movie!");
  expect(response.body.user_id).toBe(mockUser._id.toString());  // Check if the user_id is correctly saved
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
      user_id: new mongoose.Types.ObjectId(), // Ensure a valid ObjectId is provided
      movie_id: new mongoose.Types.ObjectId(),
      rating: 5,
      comment: "Great movie!"
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
      user_id: new mongoose.Types.ObjectId(), // Ensure a valid ObjectId is provided
      movie_id: new mongoose.Types.ObjectId(),
      rating: 5,
      comment: "Great movie!"
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
