const jwt = require("jsonwebtoken");

function createToken(payload) {
  return jwt.sign(payload, process.env.SECRET);
}

function readToken(token) {
  return jwt.verify(token, process.env.SECRET);
}

module.exports = { createToken, readToken };
