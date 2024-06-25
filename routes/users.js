const router = require('express').Router();


router.get('/', (req, res) => {
    res.send("Hello World! From Users")
});

module.exports = router;