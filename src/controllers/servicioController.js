const {
  crearServicio,
  obtenerServicios,
  actualizarServicio,
  eliminarServicio,
} = require('../services/servicioServices');

const servicioController = {
  getServicios: async (req, res) => {
    try {
      const servicios = await obtenerServicios();
      res.status(200).json(servicios);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener servicios' });
    }
  },

  createServicio: async (req, res) => {
    try {
      const servicio = await crearServicio(req.body);
      res.status(201).json(servicio);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  updateServicio: async (req, res) => {
    try {
      const { id } = req.params;
      const servicio = await actualizarServicio(id, req.body);
      res.status(200).json(servicio);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteServicio: async (req, res) => {
    try {
      const { id } = req.params;
      const servicio = await eliminarServicio(id);
      res.status(200).json(servicio);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = servicioController;
