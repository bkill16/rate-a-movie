const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Movies API',
        description: 'API documentation for the Movies blog for Rate-a-Movie, with moves, users, actors, and Reviews.',
    },
    host: ['localhost:8080'],
    schemes: ['http'],
};

// const outputFile = './swagger-output.json';
const outputFile = './swagger.json';

const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc);