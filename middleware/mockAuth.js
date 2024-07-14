const mockAuth = (req, res, next) => {
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        sub: 'auth0|123456789',
        email: 'testuser@example.com',
        name: 'Test User',
      },
    };
    next();
  };
  
  module.exports = mockAuth;
  