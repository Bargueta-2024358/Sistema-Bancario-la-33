const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    alias: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    accountHolderName: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, accountNumber: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
