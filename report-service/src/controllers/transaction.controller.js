const transactionService = require('../services/transaction.service');

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};
