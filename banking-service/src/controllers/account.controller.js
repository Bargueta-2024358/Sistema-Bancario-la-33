const service = require("../services/account.service");
const Account = require("../models/account.model");

exports.createAccount = async (req, res, next) => {
    try {

        const { userId, accountNumber, balance } = req.body;

        console.log("UserId recibido:", userId); // 👈 verifica

        const newAccount = new Account({
            userId,
            accountNumber,
            balance
        });

        await newAccount.save();

        res.status(201).json(newAccount);

    } catch (error) {
        next(error);
    }
};

exports.deactivateAccount = async (req, res, next) => {
    try {
        const account = await service.deactivateAccount(req.params.accountNumber);
        res.json({ message: "Cuenta desactivada", account });
    } catch (error) {
        next(error);
    }
};

exports.deposit = async (req, res, next) => {
    try {
        const account = await service.deposit(
            req.user.sub,
            req.params.accountNumber,
            req.body.amount
        );
        res.json(account);
    } catch (error) {
        next(error);
    }
};

exports.withdraw = async (req, res, next) => {
    try {
        const account = await service.withdraw(
            req.user.id,
            req.params.accountNumber,
            req.body.amount
        );
        res.json(account);
    } catch (error) {
        next(error);
    }
};

exports.getBalance = async (req, res, next) => {
    try {
        const balance = await service.getBalance(
            req.user.id,
            req.params.accountNumber
        );
        res.json({ balance });
    } catch (error) {
        next(error);
    }
};

exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await service.getTransactions(
            req.user.id,
            req.params.accountNumber
        );
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};