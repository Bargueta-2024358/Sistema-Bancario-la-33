const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
const generateAccountNumber = require("../../helpers/generateAccountNumber");

class AccountService {

    async createAccount(userId) {

        return await Account.create({
            userId,
            accountNumber: generateAccountNumber()
        });
    }

    async deactivateAccount(accountNumber) {

        const account = await Account.findOne({ accountNumber });
        if (!account) throw new Error("Cuenta no encontrada");

        account.isActive = false;
        await account.save();

        return account;
    }

    async deposit(userId, accountNumber, amount) {

        amount = Number(amount);

        const account = await Account.findOne({ accountNumber });

        if (!account) throw new Error("Cuenta no encontrada");

        if (account.userId.toString() !== userId)
            throw new Error("No autorizado");

        if (!account.isActive)
            throw new Error("Cuenta desactivada");

        if (amount <= 0)
            throw new Error("Monto inválido");

        account.balance += amount;
        await account.save();

        await Transaction.create({
            accountNumber,
            type: "DEPOSIT",
            amount
        });

        return account;
    }

    async withdraw(userId, accountNumber, amount) {

        const account = await Account.findOne({ accountNumber, userId });
        if (!account) throw new Error("Cuenta no encontrada");
        if (!account.isActive) throw new Error("Cuenta desactivada");
        if (amount <= 0) throw new Error("Monto inválido");
        if (account.balance < amount)
            throw new Error("Fondos insuficientes");

        account.balance -= amount;
        await account.save();

        await Transaction.create({
            accountNumber,
            type: "WITHDRAW",
            amount
        });

        return account;
    }

    async getBalance(userId, accountNumber) {

        const account = await Account.findOne({ accountNumber, userId });
        if (!account) throw new Error("Cuenta no encontrada");
        if (!account.isActive) throw new Error("Cuenta desactivada");

        return account.balance;
    }

    async getTransactions(userId, accountNumber) {

        const account = await Account.findOne({ accountNumber, userId });
        if (!account) throw new Error("Cuenta no encontrada");
        if (!account.isActive) throw new Error("Cuenta desactivada");

        return await Transaction.find({ accountNumber })
            .sort({ createdAt: -1 });
    }
}

module.exports = new AccountService();