require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./configs/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const accountRoutes = require('./src/routes/account.routes');

const app = express();
const PORT = process.env.PORT || 3021;

dbConnection();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({
    status: 'Saludable',
    service: 'banking-service',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/accounts', authMiddleware, accountRoutes);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Banking Service corriendo en puerto ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
