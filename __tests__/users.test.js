const express = require('express');
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect');
const request = require('supertest');
const getAuth0Token = require('../util/auth');
const usersRoute = require('../routes/users');
const connectDB = require('../database/connect');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

jest.mock('../middleware/checkUser', () => jest.fn((req, res, next) => {
  req.oidc = {
    isAuthenticated: () => true,
    user: {
      sub: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    }
  };
  next();
}));

let token;
let userId;

beforeAll(async () => {
  token = await getAuth0Token();
  await connectDB();
  await User.deleteMany({}); // Clean up the test database before running tests
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
  await new Promise((resolve) => setTimeout(resolve, 500));
});

const createTestApp = () => {
  const app = express();

  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  };

  app.use(auth(config));
  app.use(bodyParser.json());
  app.use('/users', usersRoute);

  return app;
};

describe('User Routes', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  it('should create a user profile', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(201);
    expect(response.text).toBe('User profile created');
    userId = response.body.auth0Id;
  });


  it('should get user profile', async () => {
    const response = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('auth0Id');
    expect(response.body).toHaveProperty('email');
  });

  it('should update user profile', async () => {
    const response = await request(app)
      .put(`/users/test-user-id`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`User with ID: test-user-id updated`);
  });

  it('should delete user profile', async () => {
    const response = await request(app)
      .delete(`/users/test-user-id`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`User with ID: test-user-id deleted`);
  });
});
