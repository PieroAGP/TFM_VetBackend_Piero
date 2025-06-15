const Servicio = require('../models/Servicio');

async function crearServicio(data) {
  const nuevoServicio = new Servicio(data);
  return await nuevoServicio.save();
}

async function obtenerServicios() {
  return await Servicio.find();
}

async function actualizarServicio(id, data) {
  const actualizado = await Servicio.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!actualizado) throw new Error('Servicio no encontrado');
  return actualizado;
}

async function eliminarServicio(id) {
  const eliminado = await Servicio.findByIdAndDelete(id);
  if (!eliminado) throw new Error('Servicio no encontrado');
  return eliminado;
}

module.exports = {
  crearServicio,
  obtenerServicios,
  actualizarServicio,
  eliminarServicio
};
