// npm install --save-dev jest supertest
// to run the tests 'npm test'

const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;
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
  server = app.listen(8084);
});

afterEach(async () => {
  await MovieActor.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
  await mongoose.disconnect();
  await new Promise((resolve) => setTimeout(resolve, 500));
});

describe("Rate a Movie API - MovieActors", () => {
  it("should get all movie actor relationships", async () => {
    const relationship1 = new MovieActor({
      movieId: new mongoose.Types.ObjectId(),
      actorId: new mongoose.Types.ObjectId(),
      role: "Chewbacca",
    });
    const relationship2 = new MovieActor({
      movieId: new mongoose.Types.ObjectId(),
      actorId: new mongoose.Types.ObjectId(),
      role: "Boba Fett",
    });
    const relationship3 = new MovieActor({
      movieId: new mongoose.Types.ObjectId(),
      actorId: new mongoose.Types.ObjectId(),
      role: "Jabba the Hutt",
    });
    await relationship1.save();
    await relationship2.save();
    await relationship3.save();

    const response = await request(app).get("/movie-actors");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it("should create a new movie actor relationship", async () => {
    const response = await request(app).post("/movie-actors").send({
      movieId: new mongoose.Types.ObjectId(),
      actorId: new mongoose.Types.ObjectId(),
      role: "Boba Fett",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.savedMovieActor.role).toBe("Boba Fett");
  });

  it("should update a movie actor relationship by id", async () => {
    const relationship = new MovieActor({
      movieId: new mongoose.Types.ObjectId(),
      actorId: new mongoose.Types.ObjectId(),
      role: "Elrond",
    });
    await relationship.save();

    const response = await request(app)
      .put(`/movie-actors/${relationship._id}`)
      .send({
        movieId: relationship.movieId,
        actorId: new mongoose.Types.ObjectId(),
        role: "Legolas",
      });

    expect(response.statusCode).toBe(204);
  });

  it("should delete a movie actor relationship by id", async () => {
    const relationship = new MovieActor({
      movieId: new mongoose.Types.ObjectId(),
      actorId: new mongoose.Types.ObjectId(),
      role: "Kermit the Frog",
    });
    await relationship.save();

    const response = await request(app).delete(
      `/movie-actors/${relationship._id}`
    );

    expect(response.statusCode).toBe(204);
  });

  it("should return a 404 for a non-existent relationship on put", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/movie-actors/${nonExistentId}`)
      .send({
        movieId: new mongoose.Types.ObjectId(),
        actorId: new mongoose.Types.ObjectId(),
        role: "Gandalf",
      });

    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent relationship on delete", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(
      `/movie-actors/${nonExistentId}`
    );

    expect(response.statusCode).toBe(404);
  });
});
