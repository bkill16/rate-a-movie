const routes = require("express").Router();


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


routes.use('/api-docs', swaggerUi.serve);
routes.get('/api-docs', swaggerUi.setup(swaggerDocument)); // http://localhost:8080/api-docs


routes.use("/users", require("./users"));
routes.use("/reviews", require("./review"));
routes.use("/actors", require("./actors"));
routes.use("/movie-actors", require("./movieActors"));
routes.use("/movies", require("./movies"))

routes.get("/", (req, res) => {
  res.send("Hello World!");
});




module.exports = routes;
