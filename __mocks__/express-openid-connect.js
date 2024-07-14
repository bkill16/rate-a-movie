const express = require('express');

module.exports = {
  auth: () => (req, res, next) => {
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    };
    next();
  },
  requiresAuth: () => (req, res, next) => {
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    };
    next();
  },
};
