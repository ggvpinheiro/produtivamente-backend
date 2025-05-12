// routes/gamificationRoutes.js
const express = require('express');
const router = express.Router();
const {
  adicionarPontos,
  listarConquistas,
  adicionarConquista,
} = require('../controllers/gamificationController');
const proteger = require('../middleware/authMiddleware');

// Todas as rotas exigem autenticação
router.post('/pontos', proteger, adicionarPontos);
router.get('/conquistas', proteger, listarConquistas);
router.post('/conquistas', proteger, adicionarConquista);

module.exports = router;
