const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Solo usuarios logueados pueden ver o crear citas
router.get('/', citaController.getCitas);
router.post('/', citaController.createCita);
router.get('/disponibles', citaController.getTramosDisponibles);
router.delete('/:id', citaController.deleteCita);

module.exports = router;
