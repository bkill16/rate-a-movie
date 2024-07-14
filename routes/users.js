const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const usersController = require('../controllers/users');
const { updateUserValidationRules, validateUpdateUser } = require('../util/validation/userValidator');

// POST /users
router.post('/', requiresAuth(), usersController.createUser);

// GET /users/login
router.get('/login', usersController.loginUser);

// GET /users/logout
router.get('/logout', usersController.logoutUser);

// GET /users/profile
router.get('/profile', requiresAuth(), usersController.getUserProfile);

// PUT /users/:id
router.put('/:id', requiresAuth(), updateUserValidationRules, validateUpdateUser, usersController.updateUserById);

// DELETE /users/:id
router.delete('/:id', requiresAuth(), usersController.deleteUserById);

module.exports = router;
