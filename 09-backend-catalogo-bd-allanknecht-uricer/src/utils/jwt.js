const jwt = require('jsonwebtoken');
const config = require('../config/config');

function gerarToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
}

function verificarToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = { gerarToken, verificarToken };
