const routes = require("express").Router();

routes.use("/users", require("./users"));
// routes.use("/review", require("./review")); - commented out due to bugs
routes.use("/actors", require("./actors"));
routes.use("/movie-actors", require("./movieActors"));
routes.use("/movies", require("./movies"))

routes.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = routes;
