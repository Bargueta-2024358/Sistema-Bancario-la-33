const express = require('express');
const { createTransaction } = require('../controllers/transaction.controller');
const internal = require('../../middlewares/internal.middleware');

const router = express.Router();


router.post('/', internal, createTransaction);

module.exports = router;
