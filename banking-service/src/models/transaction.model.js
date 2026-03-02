const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    accountNumber: String,
    type: {
        type: String,
        enum: ["DEPOSIT", "WITHDRAW"]
    },
    amount: Number
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);