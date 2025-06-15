const mongoose = require('mongoose');


const mascotaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  edad: {
    type: Number,
    required: true,
    min: [0, 'La edad no puede ser negativa']
  },
  peso: {
    type: Number,
    required: true,
    min: [0, 'El peso no puede ser negativo']
  },
  observaciones: {
    type: String,
    default: ''
  },
  foto: {
    type: String // Aquí guardaremos la ruta del archivo
  },
  fechaAlta: {
    type: Date,
    default: Date.now
  }
});

const Mascota = mongoose.model('Mascota', mascotaSchema);
module.exports = Mascota;
