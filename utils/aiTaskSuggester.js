// utils/aiTaskSuggester.js

/**
 * Simula sugestões de tarefas baseadas no perfil e comportamento do usuário.
 * Futuramente, isso pode ser substituído por uma API real de IA.
 */

function sugerirTarefas({ nivel, conquistas, tarefasRecentes }) {
  const tarefasBase = [
    'Organizar o ambiente de trabalho',
    'Revisar metas da semana',
    'Planejar o dia de amanhã',
    'Meditar por 10 minutos',
    'Estudar 30 minutos de um novo assunto',
    'Responder e-mails importantes',
    'Fazer uma pausa ativa',
    'Atualizar seu planner ou agenda',
  ];

  const tarefasRecomendadas = [];

  // Regras simples baseadas em nível
  if (nivel <= 2) {
    tarefasRecomendadas.push(
      'Criar uma rotina diária simples',
      'Estabelecer 3 metas para hoje'
    );
  } else {
    tarefasRecomendadas.push(
      'Eliminar uma tarefa procrastinada',
      'Delegar ou reavaliar tarefas de baixo impacto'
    );
  }

  // Evita repetir tarefas recentes
  const sugeridas = tarefasBase.filter(tarefa => !tarefasRecentes?.includes(tarefa));

  // Retorna até 3 sugestões
  return [...tarefasRecomendadas, ...sugeridas.slice(0, 3)];
}

module.exports = { sugerirTarefas };