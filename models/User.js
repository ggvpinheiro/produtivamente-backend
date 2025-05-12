// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  senha: {
    type: String,
    required: true,
  },
  pontos: {
    type: Number,
    default: 0,
  },
  nivel: {
    type: Number,
    default: 1,
  },
  conquistas: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// Criptografar a senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método para comparar senhas
UserSchema.methods.compararSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('User', UserSchema);
