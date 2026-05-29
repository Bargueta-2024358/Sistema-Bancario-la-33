class ReportError extends Error {
  constructor(message, statusCode = 400, code = 'REPORT_ERROR') {
    super(message);
    this.name = 'ReportError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

module.exports = ReportError;
