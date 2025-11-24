const { gerarToken } = require('../utils/jwt.js');

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const usuariosPermitidos = {
  'admin@admin.com': 'admin123',
};

async function login(email, password) {
  if (!email || !validarEmail(email)) {
    throw new Error('E-mail inválido');
  }

  if (!password) {
    throw new Error('Senha é obrigatória');
  }

  const senhaCorreta = usuariosPermitidos[email];
  if (!senhaCorreta || senhaCorreta !== password) {
    throw new Error('E-mail ou senha inválidos');
  }

  return gerarToken({ email });
}

module.exports = { login };
