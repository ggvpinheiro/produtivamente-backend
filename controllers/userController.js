const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar novo usuário
exports.registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Usuário já cadastrado.' });

    const user = new User({ nome, email, senha });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário.', error });
  }
};

// Login do usuário
exports.loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuário não encontrado.' });

    const senhaCorreta = await user.compararSenha(senha);
    if (!senhaCorreta) return res.status(400).json({ message: 'Senha incorreta.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        pontos: user.pontos,
        nivel: user.nivel,
        conquistas: user.conquistas
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login.', error });
  }
};
