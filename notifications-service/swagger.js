const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 3023;

module.exports = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notifications Service - Banco La 33',
      version: '1.0.0',
      description: 'Notificaciones in-app, alertas, confirmaciones y correos.',
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        serviceKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-service-key',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});
