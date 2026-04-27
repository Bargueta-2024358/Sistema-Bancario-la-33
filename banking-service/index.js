require("dotenv").config();
const express = require("express");
const { dbConnection } = require('./configs/db');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authMiddleware = require("./middlewares/auth.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const accountRoutes = require("./src/routes/account.routes");

const app = express();

dbConnection();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/accounts", authMiddleware, accountRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Accounts Service corriendo en puerto ${process.env.PORT}`);
});