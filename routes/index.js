const routes = require("express").Router();

routes.use("/users", require("./users"));
routes.use("/review", require("./review"));
routes.use("/actors", require("./actors"));

routes.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = routes;
