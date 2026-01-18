const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SailReservations API',
      version: '1.0.0',
      description: 'API do systemu rezerwacji żaglówek',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Serwer lokalny' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Ścieżka do plików z dokumentacją
};

module.exports = swaggerJsdoc(options);