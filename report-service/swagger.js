const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 3022;

module.exports = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Report Service - Banco La 33',
      version: '1.0.0',
      description: 'Estados de cuenta, reportes financieros, historial, estadísticas y exportación PDF/Excel.',
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});
