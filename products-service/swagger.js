import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Productos y Monedas - Banco La 33",
      version: "1.0.0",
      description: "Documentación completa de la API para la gestión de productos bancarios, tipos de cuenta, monedas, tasas de cambio y eventos del sistema. Esta API permite administrar los elementos fundamentales del sistema bancario de manera eficiente y segura.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./src/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;