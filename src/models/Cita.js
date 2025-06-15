const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  id_cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id_profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id_mascota: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mascota',
    required: true
  },
  id_servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  tramo: {
    type: Date, // Fecha y hora exacta de inicio
    required: true
  },
  ocupacion: {
    type: Boolean,
    default: true // true = reservado, false = disponible (por si luego usas slots predefinidos)
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

const Cita = mongoose.model('Cita', citaSchema);
module.exports = Cita;
