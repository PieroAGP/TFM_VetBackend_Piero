const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const upload = require('../middlewares/uploadMascota');

// CRUD de mascotas
router.get('/', mascotaController.getMascotas);
router.post('/', upload.single('foto'), mascotaController.createMascota);
router.put('/:id', upload.single('foto'), mascotaController.updateMascota);
router.delete('/:id', mascotaController.deleteMascota);

module.exports = router;
