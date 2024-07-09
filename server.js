const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const connectDB = require("./database/connect");

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

module.exports = startServer;