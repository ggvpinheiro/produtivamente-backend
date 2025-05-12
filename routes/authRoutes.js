// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/authController');

// Rota de registro
router.post('/registrar', registrar);

// Rota de login
router.post('/login', login);

module.exports = router;
