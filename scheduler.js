const cron = require('node-cron');
const Task = require('./models/Task');
const User = require('./models/User');

function gerarDesafiosParaUsuario(usuario) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return Task.find({
    usuario: usuario._id,
    desafioDiario: true,
    createdAt: { $gte: hoje }
  }).then(existentes => {
    if (existentes.length > 0) {
      console.log(`Usuário ${usuario.email} já tem desafios hoje.`);
      return;
    }

    const sugestoes = [
      { titulo: 'Revisar metas da semana', descricao: 'Planeje seus objetivos.' },
      { titulo: 'Organizar área de trabalho', descricao: 'Comece com clareza.' },
      { titulo: 'Pausa ativa de 10 minutos', descricao: 'Movimente-se um pouco.' }
    ];

    const tarefas = sugestoes.map(sugestao => ({
      ...sugestao,
      usuario: usuario._id,
      origem: 'ia',
      desafioDiario: true
    }));

    return Task.insertMany(tarefas);
  });
}

function iniciarAgendadorDiario() {
  // Executa todos os dias às 07:00
  cron.schedule('0 7 * * *', async () => {
    console.log('⏰ Gerando desafios diários...');

    try {
      const usuarios = await User.find();

      for (const usuario of usuarios) {
        await gerarDesafiosParaUsuario(usuario);
      }

      console.log('✅ Desafios diários gerados com sucesso!');
    } catch (erro) {
      console.error('❌ Erro ao gerar desafios diários:', erro);
    }
  });
}

module.exports = iniciarAgendadorDiario;
