const mongoose = require('mongoose');

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  rol: {
    type: String,
    enum: ['usuario', 'absoluteAdmin', 'administrador'],
    default: 'usuario',
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
  },
  fechaAlta: {
    type: Date,
    required: true,
    default: Date.now,
  },
  edad: {
    type: Number,
    min: [0, 'La edad no puede ser negativa'],
  },
  ubicacion: {
    type: String,
  },
});

// Crear el modelo de usuario
const User = mongoose.model('User', userSchema); // Colección: users

module.exports = User;
