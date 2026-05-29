export default class ProductsError extends Error {
  constructor(message, statusCode = 400, code = 'PRODUCTS_ERROR') {
    super(message);
    this.name = 'ProductsError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
