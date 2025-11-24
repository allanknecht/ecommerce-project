const authService = require('../services/auth.service');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = { login };
