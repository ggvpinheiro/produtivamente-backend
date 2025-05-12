// controllers/gamificationController.js
const User = require('../models/User');
const Reward = require('../models/Reward');

// Adicionar pontos ao usuário e atualizar nível
exports.adicionarPontos = async (req, res) => {
  const { pontos } = req.body;

  if (!pontos || typeof pontos !== 'number') {
    return res.status(400).json({ mensagem: 'Pontos inválidos' });
  }

  try {
    const usuario = await User.findById(req.usuario._id);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    usuario.pontos += pontos;

    // Atualizar nível automaticamente (ex: sobe 1 nível a cada 100 pontos)
    const novoNivel = Math.floor(usuario.pontos / 100) + 1;
    if (novoNivel > usuario.nivel) {
      usuario.nivel = novoNivel;
    }

    await usuario.save();

    res.json({
      mensagem: `+${pontos} pontos adicionados!`,
      pontos: usuario.pontos,
      nivel: usuario.nivel,
    });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao adicionar pontos' });
  }
};

// Ver conquistas do usuário
exports.listarConquistas = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.json({ conquistas: usuario.conquistas });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar conquistas' });
  }
};

// Marcar conquista manualmente (pode ser usado por regras da IA ou sistema)
exports.adicionarConquista = async (req, res) => {
  const { nome } = req.body;

  try {
    const usuario = await User.findById(req.usuario._id);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    if (!usuario.conquistas.includes(nome)) {
      usuario.conquistas.push(nome);
      await usuario.save();
    }

    res.json({ mensagem: 'Conquista adicionada', conquistas: usuario.conquistas });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao adicionar conquista' });
  }
};
