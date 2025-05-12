const express = require('express');
const router = express.Router();
const {
  criarTarefa,
  listarTarefas,
  atualizarTarefa,
  deletarTarefa,
  concluirTarefa,
  sugerirTarefas
} = require('../controllers/taskController');
const proteger = require('../middleware/authMiddleware');

// Todas as rotas exigem autenticação
router.post('/', proteger, criarTarefa);
router.get('/', proteger, listarTarefas);
router.put('/:id', proteger, atualizarTarefa);
router.delete('/:id', proteger, deletarTarefa);

// ✅ Rotas adicionadas
router.put('/:id/concluir', proteger, concluirTarefa);
router.get('/sugestoes', proteger, sugerirTarefas);

module.exports = router;
