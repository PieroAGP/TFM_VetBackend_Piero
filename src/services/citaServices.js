const Cita = require("../models/Cita");

// Crear cita
async function crearCita(data) {
  const nuevaCita = new Cita(data);
  return await nuevaCita.save();
}

// Obtener citas (por usuario logueado o profesional)
async function obtenerCitas({ id_cliente, id_profesional }) {
  const filtro = {};
  if (id_cliente) filtro.id_cliente = id_cliente;
  if (id_profesional) filtro.id_profesional = id_profesional;

  return await Cita.find(filtro)
    .populate("id_cliente", "nombre email")
    .populate("id_profesional", "nombre email")
    .populate("id_mascota", "nombre")
    .populate("id_servicio", "nombre duracion");
}

// Eliminar cita
async function eliminarCita(id) {
  const cita = await Cita.findByIdAndDelete(id);
  if (!cita) throw new Error("Cita no encontrada");
  return cita;
}

// Validar disponibilidad
async function validarDisponibilidad(id_profesional, tramo, duracion) {
  const inicio = new Date(tramo);
  const fin = new Date(inicio.getTime() + duracion * 60000);

  const citasExistentes = await Cita.find({
    id_profesional,
    tramo: {
      $gte: inicio,
      $lt: fin,
    },
    ocupacion: true,
  });

  return citasExistentes.length === 0;
}

const generarTramosDisponibles = async (id_profesional, fechaISO, duracion) => {
  const inicioJornada = new Date(`${fechaISO}T08:00:00`);
  const finJornada = new Date(`${fechaISO}T16:00:00`);
  const tramos = [];

  const citas = await Cita.find({
    id_profesional,
    tramo: {
      $gte: inicioJornada,
      $lt: finJornada,
    },
    ocupacion: true,
  });

  const citasOcupadas = citas.map((cita) => ({
  inicio: new Date(cita.tramo),
  fin: new Date(cita.tramo.getTime() + duracion * 60000),
}));

  for (
    let t = new Date(inicioJornada);
    t < finJornada;
    t.setMinutes(t.getMinutes() + duracion)
  ) {
    const inicio = new Date(t);
    const fin = new Date(t.getTime() + duracion * 60000);

    // Verificamos si se solapa con alguna cita ocupada
    const solapado = citasOcupadas.some(
      (cita) =>
        (inicio >= cita.inicio && inicio < cita.fin) ||
        (fin > cita.inicio && fin <= cita.fin)
    );

    if (!solapado && fin <= finJornada) {
      tramos.push(new Date(inicio));
    }
  }

  return tramos;
};

module.exports = {
  crearCita,
  obtenerCitas,
  eliminarCita,
  validarDisponibilidad,
  generarTramosDisponibles,
};
