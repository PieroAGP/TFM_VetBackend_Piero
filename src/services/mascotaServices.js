require('../models/User');
const Mascota = require('../models/Mascota');


async function crearMascota(data) {
  const nueva = new Mascota(data);
  return await nueva.save();
}

async function obtenerMascotas(id_usuario) {
  return await Mascota.find({ id_usuario }).populate('id_usuario', 'nombre correo');
}

async function actualizarMascota(id, data) {
  const actualizada = await Mascota.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!actualizada) throw new Error('Mascota no encontrada');
  return actualizada;
}

async function eliminarMascota(id) {
  const eliminada = await Mascota.findByIdAndDelete(id);
  if (!eliminada) throw new Error('Mascota no encontrada');
  return eliminada;
}

module.exports = {
  crearMascota,
  obtenerMascotas,
  actualizarMascota,
  eliminarMascota
};
