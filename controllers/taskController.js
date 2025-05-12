const Task = require('../models/Task');
const User = require('../models/User');

// Criar nova tarefa
exports.criarTarefa = async (req, res) => {
  const { titulo, descricao, origem } = req.body;

  try {
    const novaTarefa = await Task.create({
      titulo,
      descricao,
      usuario: req.usuario._id,
      origem: origem || 'manual',
    });

    res.status(201).json(novaTarefa);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar tarefa' });
  }
};

// Listar tarefas do usuário
exports.listarTarefas = async (req, res) => {
  try {
    const tarefas = await Task.find({ usuario: req.usuario._id }).sort({ createdAt: -1 });
    res.json(tarefas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas' });
  }
};

// Atualizar tarefa (status, título, descrição)
exports.atualizarTarefa = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, status } = req.body;

  try {
    const tarefa = await Task.findOneAndUpdate(
      { _id: id, usuario: req.usuario._id },
      { titulo, descricao, status },
      { new: true }
    );

    if (!tarefa) return res.status(404).json({ mensagem: 'Tarefa não encontrada' });

    res.json(tarefa);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar tarefa' });
  }
};

// Deletar tarefa
exports.deletarTarefa = async (req, res) => {
  const { id } = req.params;

  try {
    const tarefa = await Task.findOneAndDelete({ _id: id, usuario: req.usuario._id });

    if (!tarefa) return res.status(404).json({ mensagem: 'Tarefa não encontrada' });

    res.json({ mensagem: 'Tarefa excluída com sucesso' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao excluir tarefa' });
  }
};

// Concluir tarefa com gamificação
exports.concluirTarefa = async (req, res) => {
  const { id } = req.params;

  try {
    const tarefa = await Task.findOneAndUpdate(
      { _id: id, usuario: req.usuario._id },
      { status: 'concluida' },
      { new: true }
    );

    if (!tarefa) return res.status(404).json({ mensagem: 'Tarefa não encontrada' });

    // Aplicar gamificação
    const user = await User.findById(req.usuario._id);

    // Impede pontuação duplicada
    if (tarefa.status !== 'concluida') {
      user.pontos += 10;

      if (user.pontos >= user.nivel * 100) {
        user.nivel += 1;
        if (!user.conquistas.includes('Subiu de nível')) {
          user.conquistas.push('Subiu de nível');
        }
      }

      const concluidas = await Task.countDocuments({ usuario: user._id, status: 'concluida' });

      if (concluidas === 1 && !user.conquistas.includes('Primeira tarefa')) {
        user.conquistas.push('Primeira tarefa');
      }

      if (concluidas === 5 && !user.conquistas.includes('5 tarefas concluídas')) {
        user.conquistas.push('5 tarefas concluídas');
      }

      await user.save();
    }

    res.json({ mensagem: 'Tarefa concluída com sucesso!', tarefa });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao concluir tarefa' });
  }
};

// Sugestão de tarefas com IA simples
exports.sugerirTarefas = async (req, res) => {
  try {
    const historico = await Task.find({ usuario: req.usuario._id }).limit(50);

    const categorias = {};
    historico.forEach(t => {
      categorias[t.origem] = (categorias[t.origem] || 0) + 1;
    });

    const maisComum = Object.keys(categorias).reduce((a, b) => categorias[a] > categorias[b] ? a : b, 'manual');

    const sugestoes = [
      { titulo: 'Revisar metas semanais', origem: 'ia' },
      { titulo: 'Organizar tarefas pendentes', origem: 'ia' },
      { titulo: `Criar nova tarefa com base em: ${maisComum}`, origem: 'ia' }
    ];

    res.json(sugestoes);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao sugerir tarefas' });
  }
};
