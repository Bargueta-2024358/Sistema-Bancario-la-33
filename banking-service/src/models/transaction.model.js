const mongoose = require('mongoose');
const { TRANSACTION_TYPES } = require('../constants/banking.constants');

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    accountNumber: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    targetAccountNumber: { type: String, default: null },
    description: { type: String, default: '' },
    accountType: { type: String, default: '' },
    reverted: { type: Boolean, default: false },
    revertedAt: { type: Date, default: null },
    performedByUserId: { type: String, default: null },
  },
  { timestamps: true }
);

transactionSchema.index({ accountNumber: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
