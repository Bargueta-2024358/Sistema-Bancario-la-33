const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    accountNumber: { type: String, unique: true, required: true },
    accountTypeId: { type: String, default: null },
    balance: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
