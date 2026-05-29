require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { connectDb } = require('./configs/db');
const errorHandler = require('./middlewares/error.middleware');
const transactionRoutes = require('./src/routes/transaction.routes');
const reportRoutes = require('./src/routes/report.routes');

const app = express();
const PORT = process.env.PORT || 3022;

const start = async () => {
  await connectDb();

  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'report-service',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/reports', reportRoutes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Report Service en puerto ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  });
};

start().catch((err) => {
  console.error('Error al iniciar Report Service:', err.message);
  process.exit(1);
});
