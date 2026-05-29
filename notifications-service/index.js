require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { dbConnection } = require('./configs/db');
const errorHandler = require('./middlewares/error.middleware');
const notificationRoutes = require('./src/routes/notification.routes');
const eventRoutes = require('./src/routes/event.routes');

const app = express();
const PORT = process.env.PORT || 3023;

const start = async () => {
  await dbConnection();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'notifications-service',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/events', eventRoutes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Notifications Service en puerto ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`Health: http://localhost:${PORT}/health`);
  });
};

start().catch((err) => {
  console.error('Error al iniciar:', err.message);
  process.exit(1);
});
