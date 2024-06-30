const router = require('express').Router();


// POST /user
router.post("/", (req, res) => {
    // Logic to create a new user
    res.send("User created");
  });
  
  // GET /user/login
  router.get("/login", (req, res) => {
    // Logic for user login
    res.send("User login");
  });
  
  // GET /user/logout
  router.get("/logout", (req, res) => {
    // Logic for user logout
    res.send("User logout");
  });
  
  // GET /user/{id}
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    // Logic to get a user by ID
    res.send(`User details for ID: ${id}`);
  });
  
  // PUT /user/{id}
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    // Logic to update a user by ID
    res.send(`User with ID: ${id} updated`);
  });
  
  // DELETE /user/{id}
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    // Logic to delete a user by ID
    res.send(`User with ID: ${id} deleted`);
  });
  

module.exports = router;