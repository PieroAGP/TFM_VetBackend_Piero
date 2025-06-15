const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  costo: {
    type: Number,
    required: true,
    min: [0, 'El costo no puede ser negativo'],
  },
  duracion: {
    type: Number,
    required: true,
    min: [1, 'La duración debe ser al menos 1 minuto'],
  },
  fechaAlta: {
    type: Date,
    default: Date.now,
  },
});

const Servicio = mongoose.model('Servicio', servicioSchema); // Colección: servicios
module.exports = Servicio;
