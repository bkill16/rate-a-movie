const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const connectDB = require("../database/connect");
const mongoose = require("mongoose");
require("dotenv").config();

const routes = require("../routes");

let app;
let server;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  app = express();
  app.use(bodyParser.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/", routes);

  await connectDB();
  server = app.listen(8082);
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
  await mongoose.disconnect();
  await new Promise((resolve) => setTimeout(resolve, 500));
});

describe("API Routes", () => {
  it("should return 'Hello World!' on the root route", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello World!");
  });

  it("should return Swagger API documentation", async () => {
    const response = await request(app).get("/api-docs").redirects(1);
    expect(response.statusCode).toBe(200);
  });

  it("should return 200 for /reviews route", async () => {
    const response = await request(app).get("/reviews");
    expect(response.statusCode).toBe(200);
  });

  it("should return 200 for /actors route", async () => {
    const response = await request(app).get("/actors");
    expect(response.statusCode).toBe(200);
  });

  it("should return 200 for /movie-actors route", async () => {
    const response = await request(app).get("/movie-actors");
    expect(response.statusCode).toBe(200);
  });

  it("should return 200 for /movies route", async () => {
    const response = await request(app).get("/movies");
    expect(response.statusCode).toBe(200);
  });

  it("should return 404 for non-existent route", async () => {
    const response = await request(app).get("/non-existent-route");
    expect(response.statusCode).toBe(404);
  });
});
