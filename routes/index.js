const routes = require('express').Router();


routes.use('/users', require('./users'));
routes.use('/review', require('./review'));



routes.get('/', (req, res) => {
    res.send("Hello World!")
})


module.exports = routes