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

beforeAll(async () => {
  app = await startServer();
  await mongoose.connect(MONGODB_TEST_URI);
  server = app.listen(8081);
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
      movieId: "667b1de0f592b5c99c067fc3",
      actorId: "667ca138ea8a0e7bbff67a12",
      role: "Chewbacca",
    });
    const relationship2 = new MovieActor({
      movieId: "667b1de0f592b5c99c067fc8",
      actorId: "667ca138ea8a0e7bbff67a0a",
      role: "Boba Fett",
    });
    const relationship3 = new MovieActor({
      movieId: "667b1de0f592b5c99c067fc3",
      actorId: "667ca138ea8a0e7bbff67a13",
      role: "Jabba the Hutt",
    });
    await relationship1.save();
    await relationship2.save();
    await relationship3.save();

    const response = await request(app).get("/movie-actors");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);

    expect(response.body[0].movieId).toBe("667b1de0f592b5c99c067fc3");
    expect(response.body[0].actorId).toBe("667ca138ea8a0e7bbff67a12");
    expect(response.body[0].role).toBe("Chewbacca");

    expect(response.body[1].movieId).toBe("667b1de0f592b5c99c067fc8");
    expect(response.body[1].actorId).toBe("667ca138ea8a0e7bbff67a0a");
    expect(response.body[1].role).toBe("Boba Fett");

    expect(response.body[2].movieId).toBe("667b1de0f592b5c99c067fc3");
    expect(response.body[2].actorId).toBe("667ca138ea8a0e7bbff67a13");
    expect(response.body[2].role).toBe("Jabba the Hutt");
  });

  it("should create a new movie actor relationship", async () => {
    const response = await request(app).post("/movie-actors").send({
      movieId: "667b1de0f592b5c99c067fc8",
      actorId: "667ca138ea8a0e7bbff67a0a",
      role: "Boba Fett",
    });

    expect(response.statusCode).toBe(201);

    const savedMovieActor = response.body.savedMovieActor;
    
    expect(savedMovieActor.movieId).toBe("667b1de0f592b5c99c067fc8");
    expect(savedMovieActor.actorId).toBe("667ca138ea8a0e7bbff67a0a");
    expect(savedMovieActor.role).toBe("Boba Fett");
  });

  it("should update a movie actor relationship by id", async () => {
    const relationship = new MovieActor({
      movieId: "667b1de0f592b5c99c067fc3",
      actorId: "667ca138ea8a0e7bbff67a12",
      role: "Elrond",
    });
    await relationship.save();

    const response = await request(app)
      .put(`/movie-actors/${relationship._id}`)
      .send({
        movieId: "667b1de0f592b5c99c067fc3",
        actorId: "667ca138ea8a0e7bbff67a0a",
        role: "Legolas",
      });

    expect(response.statusCode).toBe(204);
  });

  it("should delete a movie actor relationship by id", async () => {
    const relationship = new MovieActor({
      movieId: "667b1de0f592b5c99c067fc8",
      actorId: "667ca138ea8a0e7bbff67a0a",
      role: "Kermit the Frog",
    });
    await relationship.save();

    const response = await request(app).delete(
      `/movie-actors/${relationship._id}`
    );

    expect(response.statusCode).toBe(204);
  });

  it("should return a 404 for a non-existent relationship on put", async () => {
    const response = await request(app)
      .put("/movie-actors/667ca138ea8a0e7bbff67a14")
      .send({
        movieId: "667b1de0f592b5c99c067fc3",
        actorId: "667ca138ea8a0e7bbff67a12",
        role: "Gandalf",
      });
    
      expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent relationship on delete", async () => {
    const response = await request(app).delete(
      "/movie-actors/667b1de0f592b5c99c067fcb"
    );
    
    expect(response.statusCode).toBe(404);
  });
});
