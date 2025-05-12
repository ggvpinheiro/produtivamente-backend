// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const proteger = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.usuario = await User.findById(decoded.id).select('-senha');
      next();
    } catch (erro) {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }
  } else {
    return res.status(401).json({ mensagem: 'Não autorizado, token ausente' });
  }
};

module.exports = proteger;
