import swaggerJSDoc from 'swagger-jsdoc';

const port = process.env.PORT || 3001;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos y Monedas - Banco La 33',
      version: '1.0.0',
      description:
        'Gestión de tipos de cuenta, productos financieros, monedas, tasas de interés/cambio y conversión con API externa (Frankfurter).',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT del servicio de autenticación',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
