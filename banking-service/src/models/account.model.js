const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);