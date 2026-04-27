const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Reportes y Transacciones - Banco La 33",
      version: "1.0.0",
      description: "Documentación completa de la API para la generación de reportes de usuario y globales, así como la creación y gestión de transacciones bancarias. Incluye endpoints para análisis financiero y seguimiento de operaciones.",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./src/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;