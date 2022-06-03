const jwt = require("jsonwebtoken");

function createToken(payload) {
  return jwt.sign(payload, process.env.SECRET || "rahasia");
}

function readToken(token) {
  return jwt.verify(token, process.env.SECRET || "rahasia");
}

module.exports = { createToken, readToken };
