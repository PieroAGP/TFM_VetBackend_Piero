const {
  crearMascota,
  obtenerMascotas,
  actualizarMascota,
  eliminarMascota,
} = require("../services/mascotaServices");

const mascotaController = {
  getMascotas: async (req, res) => {
    try {
      const id_usuario = req.query.id_usuario;
      if (!id_usuario) {
        return res
          .status(400)
          .json({ error: "Falta el id_usuario en la query" });
      }

      const mascotas = await obtenerMascotas(id_usuario);
      res.status(200).json(mascotas);
    } catch (err) {
      console.error("Error en getMascotas:", err);
      res.status(500).json({ error: "Error al obtener mascotas" });
    }
  },
  createMascota: async (req, res) => {
    try {
      const data = req.body;
      if (req.file) {
        data.foto = `/uploads/mascotas/${req.file.filename}`;
      }

      const mascota = await crearMascota(data);
      res.status(201).json(mascota);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  updateMascota: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      if (req.file) {
        data.foto = `/uploads/mascotas/${req.file.filename}`;
      }

      const mascota = await actualizarMascota(id, data);
      res.status(200).json(mascota);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteMascota: async (req, res) => {
    try {
      const { id } = req.params;
      const mascota = await eliminarMascota(id);
      res.status(200).json(mascota);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = mascotaController;
