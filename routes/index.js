const routes = require('express').Router();


routes.use('/users', require('./users'));


routes.get('/', (req, res) => {
    res.send("Hello World!")
})


module.exports = routes