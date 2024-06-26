const routes = require('express').Router();


routes.use('/users', require('./users'));
<<<<<<< HEAD
routes.use('/review', require('./review'));

=======
>>>>>>> 381661bdc2a4a43340a729cf124085d593cdf636


routes.get('/', (req, res) => {
    res.send("Hello World!")
})


module.exports = routes