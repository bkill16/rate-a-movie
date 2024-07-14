// controllers/users.js

const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const { sub: auth0Id, email, name } = req.oidc.user;
    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = new User({ auth0Id, email, name });
      await user.save();
    }

    res.status(201).send('User profile created');
  } catch (error) {
    res.status(500).send('Error creating user profile');
  }
};

const loginUser = (req, res) => {
  res.oidc.login({ returnTo: '/' });
};

const logoutUser = (req, res) => {
  res.oidc.logout({ returnTo: '/' });
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(500).send('Server Error');
      }
};

const updateUserById = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
          { auth0Id: req.params.id },
          req.body,
          { new: true }
        );
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.status(200).send(`User with ID: ${req.params.id} updated`);
      } catch (error) {
        res.status(500).send('Server Error');
      }
};

const deleteUserById = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ auth0Id: req.params.id });
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.status(200).send(`User with ID: ${req.params.id} deleted`);
      } catch (error) {
        res.status(500).send('Server Error');
      }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserById,
  deleteUserById,
};
