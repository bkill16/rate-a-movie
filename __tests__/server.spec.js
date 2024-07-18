const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const request = require("supertest");
const startServer = require("../server");

let app;
let server;

describe("Server and Database Connection", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = await startServer();
    server = app.listen(8086);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
    await mongoose.disconnect();
  });

  it("should connect to the server and database successfully", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
