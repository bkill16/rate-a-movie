const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

require("./database/connect");


app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'))
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });