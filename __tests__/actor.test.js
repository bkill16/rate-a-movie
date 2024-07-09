// npm install --save-dev jest supertest
// to run the tests 'npm test'

const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;
const Actor = require("../models/Actor");
const Movie = require("../models/Movie");
const MovieActor = require("../models/MovieActor");
const startServer = require("../server");

let app;

beforeAll(async () => {
  app = await startServer();
  await mongoose.connect(MONGODB_TEST_URI);
  server = app.listen(8081);
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

describe("Rate a Movie API - Actors", () => {
  it("should get all actors", async () => {
    const actor1 = new Actor({
      name: "Chris Pratt",
      gender: "Male",
      dob: "1979-06-21T00:00:00.000Z",
      dod: null,
      nationality: "American",
    });
    const actor2 = new Actor({
      name: "Chris Evans",
      gender: "Male",
      dob: "1981-06-13T00:00:00.000Z",
      dod: null,
      nationality: "American",
    });
    const actor3 = new Actor({
      name: "Chris Hemsworth",
      gender: "Male",
      dob: "1983-08-11T00:00:00.000Z",
      dod: null,
      nationality: "Australian",
    });
    await actor1.save();
    await actor2.save();
    await actor3.save();

    const response = await request(app).get("/actors");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);

    expect(response.body[0].name).toBe("Chris Pratt");
    expect(response.body[0].gender).toBe("Male");
    expect(response.body[0].dob).toBe("1979-06-21T00:00:00.000Z");
    expect(response.body[0].dod).toBe(null);
    expect(response.body[0].nationality).toBe("American");

    expect(response.body[1].name).toBe("Chris Evans");
    expect(response.body[1].gender).toBe("Male");
    expect(response.body[1].dob).toBe("1981-06-13T00:00:00.000Z");
    expect(response.body[1].dod).toBe(null);
    expect(response.body[1].nationality).toBe("American");

    expect(response.body[2].name).toBe("Chris Hemsworth");
    expect(response.body[2].gender).toBe("Male");
    expect(response.body[2].dob).toBe("1983-08-11T00:00:00.000Z");
    expect(response.body[2].dod).toBe(null);
    expect(response.body[2].nationality).toBe("Australian");
  });

  it("should get an actor by id", async () => {
    const actor = new Actor({
      name: "Chris Hemsworth",
      gender: "Male",
      dob: "1983-08-11T00:00:00.000Z",
      dod: null,
      nationality: "Australian",
    });
    await actor.save();

    const response = await request(app).get(`/actors/${actor._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Chris Hemsworth");
    expect(response.body.gender).toBe("Male");
    expect(response.body.dob).toBe("1983-08-11T00:00:00.000Z");
    expect(response.body.dod).toBe(null);
    expect(response.body.nationality).toBe("Australian");
  });

  it("should get actors by name", async () => {
    const actor1 = new Actor({
      name: "Chris Pratt",
      gender: "Male",
      dob: "1979-06-21T00:00:00.000Z",
      dod: null,
      nationality: "American",
    });
    const actor2 = new Actor({
      name: "Chris Evans",
      gender: "Male",
      dob: "1981-06-13T00:00:00.000Z",
      dod: null,
      nationality: "American",
    });
    const actor3 = new Actor({
      name: "Chris Hemsworth",
      gender: "Male",
      dob: "1983-08-11T00:00:00.000Z",
      dod: null,
      nationality: "Australian",
    });
    const actor4 = new Actor({
      name: "James Bond",
      gender: "Male",
      dob: "1943-09-12T00:00:00.000Z",
      dod: "2013-09-12T00:00:00.000Z",
      nationality: "British",
    });
    await actor1.save();
    await actor2.save();
    await actor3.save();
    await actor4.save();

    const searchName = "Chris";
    const encodedName = encodeURIComponent(searchName);
    const response = await request(app).get(`/actors/name/${encodedName}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);

    expect(response.body[0].name).toMatch(/Chris/);
    expect(response.body[0].gender).toBe("Male");
    expect(response.body[0].dob).toBe("1979-06-21T00:00:00.000Z");
    expect(response.body[0].dod).toBe(null);
    expect(response.body[0].nationality).toBe("American");

    expect(response.body[1].name).toMatch(/Chris/);
    expect(response.body[1].gender).toBe("Male");
    expect(response.body[1].dob).toBe("1981-06-13T00:00:00.000Z");
    expect(response.body[1].dod).toBe(null);
    expect(response.body[1].nationality).toBe("American");

    expect(response.body[2].name).toMatch(/Chris/);
    expect(response.body[2].gender).toBe("Male");
    expect(response.body[2].dob).toBe("1983-08-11T00:00:00.000Z");
    expect(response.body[2].dod).toBe(null);
    expect(response.body[2].nationality).toBe("Australian");
  });

  it("should get actors by movie title", async () => {
    const actor1 = new Actor({
      name: "Chris Pratt",
      gender: "Male",
      dob: "1979-06-21T00:00:00.000Z",
      dod: null,
      nationality: "American",
    });
    const actor2 = new Actor({
      name: "Chris Evans",
      gender: "Male",
      dob: "1981-06-13T00:00:00.000Z",
      dod: null,
      nationality: "American",
    });
    await actor1.save();
    await actor2.save();

    const movie = new Movie({
      title: "Avengers: Infinity War",
      director: "The Russo Brothers",
      production_company: "Marvel Studios",
      distribution_company: "Walt Disney Studios Motion Pictures",
      US_release_date: "2018-05-24T00:00:00.000Z",
      running_time: "149 minutes",
      audience_rating: "PG-13",
    });
    await movie.save();

    const movieActor1 = new MovieActor({
      movieId: movie._id,
      actorId: actor1._id,
      role: "Star-Lord",
    });
    const movieActor2 = new MovieActor({
      movieId: movie._id,
      actorId: actor2._id,
      role: "Captain America",
    });
    await movieActor1.save();
    await movieActor2.save();

    const response = await request(app).get("/actors/movie/avengers");

    expect(response.statusCode).toBe(200);
    expect(response.body.movie).toBe("Avengers: Infinity War");

    expect(response.body.cast[0].name).toBe("Chris Pratt");
    expect(response.body.cast[0].gender).toBe("Male");
    expect(response.body.cast[0].dob).toBe("1979-06-21T00:00:00.000Z");
    expect(response.body.cast[0].dod).toBe(null);
    expect(response.body.cast[0].nationality).toBe("American");
    expect(response.body.cast[0].role).toBe("Star-Lord");

    expect(response.body.cast[1].name).toBe("Chris Evans");
    expect(response.body.cast[1].gender).toBe("Male");
    expect(response.body.cast[1].dob).toBe("1981-06-13T00:00:00.000Z");
    expect(response.body.cast[1].dod).toBe(null);
    expect(response.body.cast[1].nationality).toBe("American");
    expect(response.body.cast[1].role).toBe("Captain America");
  });

  it("should create a new actor", async () => {
    const response = await request(app).post("/actors").send({
      name: "Chris Pratt",
      gender: "Male",
      dob: "1979-06-21T00:00:00.000Z",
      dod: null,
      nationality: "American",
    });

    expect(response.statusCode).toBe(201);

    const savedActor = response.body.savedActor;
    expect(savedActor.name).toBe("Chris Pratt");
    expect(savedActor.gender).toBe("Male");
    expect(savedActor.dob).toBe("1979-06-21T00:00:00.000Z");
    expect(savedActor.dod).toBe(null);
    expect(savedActor.nationality).toBe("American");
  });

  it("should update an actor by id", async () => {
    const actor = new Actor({
      name: "Chris Hemsworth",
      gender: "Male",
      dob: "1983-08-11T00:00:00.000Z",
      dod: null,
      nationality: "Australian",
    });
    await actor.save();

    const response = await request(app).put(`/actors/${actor._id}`).send({
      name: "Jane Doe",
      gender: "Female",
      dob: "1985-08-11T00:00:00.000Z",
      dod: null,
      nationality: "Antarctican",
    });

    expect(response.statusCode).toBe(204);
  });

  it("should delete an actor by id", async () => {
    const actor = new Actor({
      name: "Chris Hemsworth",
      gender: "Male",
      dob: "1983-08-11T00:00:00.000Z",
      dod: null,
      nationality: "Australian",
    });
    await actor.save();

    const response = await request(app).delete(`/actors/${actor._id}`);

    expect(response.statusCode).toBe(204);
  });

  it("should return a 404 for a non-existent actor on get (by id)", async () => {
    const response = await request(app).get("/actors/60c72b2f9b1d8e2f6c3e3b8c");
    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent actor on get (by name)", async () => {
    const response = await request(app).get("/actors/name/chester");
    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent actor on get (by movie title)", async () => {
    const response = await request(app).get("/actors/movie/titanic");
    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent actor on put", async () => {
    const response = await request(app)
      .put("/actors/60c72b2f9b1d8e2f6c3e3b8c")
      .send({
        name: "Jane Doe",
        gender: "Female",
        dob: "1985-08-11T00:00:00.000Z",
        dod: null,
        nationality: "Antarctican",
      });
    expect(response.statusCode).toBe(404);
  });

  it("should return a 404 for a non-existent actor on delete", async () => {
    const response = await request(app).delete(
      "/actors/60c72b2f9b1d8e2f6c3e3b8c"
    );
    expect(response.statusCode).toBe(404);
  });
});
