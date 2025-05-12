const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const iniciarAgendadorDiario = require('./scheduler');

const app = express();

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado ao MongoDB');
  iniciarAgendadorDiario(); // ⏰ Inicia o agendador de desafios diários
})
.catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tarefas', require('./routes/taskRoutes'));
app.use('/api/gamificacao', require('./routes/gamificationRoutes'));

// Rota de teste
app.get('/', (req, res) => {
  res.send('🚀 Backend ProdutivaMente está funcionando!');
});

module.exports = app;
