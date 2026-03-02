const express = require("express");
const cors = require("cors");
require("dotenv").config();

const transactionRoutes = require("./src/transaction.routes");
const reportRoutes = require("./src/report.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Report Service running on port ${process.env.PORT}`);
});