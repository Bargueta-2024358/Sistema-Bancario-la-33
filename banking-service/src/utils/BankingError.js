class BankingError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'BankingError';
    this.statusCode = statusCode;
  }
}

module.exports = BankingError;
