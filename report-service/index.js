const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const swaggerSpec = require("./swagger");

const transactionRoutes = require("./src/transaction.routes");
const reportRoutes = require("./src/report.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Report Service running on port ${process.env.PORT}`);
});