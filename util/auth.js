const axios = require('axios');

const getAuth0Token = async () => {
  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
  });

  try {
    const response = await axiosInstance.post(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, new URLSearchParams({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: 'password',
      username: process.env.AUTH0_TEST_USERNAME,
      password: process.env.AUTH0_TEST_PASSWORD,
      scope: 'openid profile email'
    }));
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Auth0 token:', error);
    throw new Error('Failed to get Auth0 token');
  } finally {
    axiosInstance.interceptors.request.eject();
  }
};

module.exports = getAuth0Token;
