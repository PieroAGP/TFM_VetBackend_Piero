const {
  crearCita,
  obtenerCitas,
  eliminarCita,
  validarDisponibilidad,
  generarTramosDisponibles,
} = require("../services/citaServices");

const Servicio = require("../models/Servicio");

const citaController = {
  getCitas: async (req, res) => {
    try {
      const { id_cliente, id_profesional } = req.query;
      const citas = await obtenerCitas({ id_cliente, id_profesional });
      res.status(200).json(citas);
    } catch (err) {
      console.error("Error al obtener citas:", err);
      res.status(500).json({ error: "Error al obtener citas" });
    }
  },

  createCita: async (req, res) => {
    try {
      const { id_servicio, id_profesional, tramo } = req.body;

      const servicio = await Servicio.findById(id_servicio);
      if (!servicio) throw new Error("Servicio no encontrado");

      const disponible = await validarDisponibilidad(
        id_profesional,
        tramo,
        servicio.duracion
      );
      if (!disponible) {
        return res.status(409).json({ error: "Tramo no disponible" });
      }

      const cita = await crearCita(req.body);
      res.status(201).json(cita);
    } catch (err) {
      console.error("Error al crear cita:", err);
      res.status(400).json({ error: err.message });
    }
  },

  deleteCita: async (req, res) => {
    try {
      const { id } = req.params;
      const cita = await eliminarCita(id);
      res.status(200).json(cita);
    } catch (err) {
      console.error("Error al eliminar cita:", err);
      res.status(400).json({ error: err.message });
    }
  },
};

const getTramosDisponibles = async (req, res) => {
  try {
    const { id_profesional, fecha, duracion } = req.query;

    if (!id_profesional || !fecha || !duracion) {
      return res.status(400).json({ error: 'Faltan parámetros: id_profesional, fecha, duracion' });
    }

    const tramos = await generarTramosDisponibles(id_profesional, fecha, parseInt(duracion));
    res.status(200).json(tramos);
  } catch (err) {
    console.error('Error al obtener tramos disponibles:', err);
    res.status(500).json({ error: 'Error al obtener tramos disponibles' });
  }
};

module.exports = {
  ...citaController,
  getTramosDisponibles
};
