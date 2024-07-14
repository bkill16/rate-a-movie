const User = require('../models/User');

const checkUser = async (req, res, next) => {
  try {
    if (req.oidc.isAuthenticated()) {
      const { sub: auth0Id, email, name } = req.oidc.user;
      let user = await User.findOne({ auth0Id });

      if (!user) {
        user = new User({ auth0Id, email, name });
        await user.save();
        console.log('User profile created');
      }
    }
    next();
  } catch (error) {
    console.error('Error checking/creating user profile:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = checkUser;
