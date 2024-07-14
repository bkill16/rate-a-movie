const express = require("express");
const { auth } = require("express-openid-connect");
const checkUser = require('./middleware/checkUser');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const connectDB = require("./database/connect");


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

app.use(auth(config));

if (process.env.NODE_ENV !== 'test') {
  app.use(checkUser);
}
const startServer = async () => {
  try {
    const dbConnection = await connectDB();

    app
      .use(bodyParser.json())
      .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      })
      .use('/', require('./routes'));

    if (process.env.NODE_ENV !== 'test') {
      app.use(checkUser);
      app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
      });
    }

    return app;
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();

}

module.exports = startServer