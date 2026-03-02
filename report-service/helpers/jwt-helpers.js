const jwt = require("jsonwebtoken");

exports.verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};