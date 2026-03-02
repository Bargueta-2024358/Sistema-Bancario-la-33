const express = require("express");
const router = express.Router();
const { createTransaction } = require("./transaction.controller");

router.post("/", createTransaction);

module.exports = router;