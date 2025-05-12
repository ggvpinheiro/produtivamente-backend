const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'concluida'],
    default: 'pendente',
  },
  origem: {
    type: String,
    enum: ['manual', 'ia'],
    default: 'manual',
  },
  desafioDiario: {
    type: Boolean,
    default: false,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
