// models/Reward.js
const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
  },
  pontosNecessarios: {
    type: Number,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['nível', 'desafio', 'especial'],
    default: 'nível',
  },
}, { timestamps: true });

module.exports = mongoose.model('Reward', RewardSchema);
