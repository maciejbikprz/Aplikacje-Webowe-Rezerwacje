const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json'; // Tu wygeneruje się dokumentacja
const endpointsFiles = ['./server.js']; // Wskaż główny plik aplikacji (lub pliki tras)

const doc = {
  info: {
    title: 'SailReservations API',
    description: 'Dokumentacja generowana automatycznie',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc);