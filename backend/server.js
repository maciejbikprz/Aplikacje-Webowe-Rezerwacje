const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const boatRoutes = require('./src/routes/boatRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger UI - wyłączamy explorer, żeby nie mieszał
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: false }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/boats', boatRoutes);
app.use('/api/reservations', reservationRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found', 
    path: req.path,
    method: req.method,
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/boats',
      'GET /api/reservations/user/:userId'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
  console.log(`Dokumentacja API: http://localhost:${PORT}/api-docs`);
});