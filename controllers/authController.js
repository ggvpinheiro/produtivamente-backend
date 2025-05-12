// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Registro
exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ mensagem: 'Usuário já existe' });
    }

    const novoUsuario = await User.create({ nome, email, senha });

    res.status(201).json({
      id: novoUsuario._id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      token: gerarToken(novoUsuario._id),
    });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    res.json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      token: gerarToken(usuario._id),
    });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
};
