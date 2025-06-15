const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');


router.get('/session', userController.getSession);
router.post('/logout', userController.logoutUser);
router.post('/login', userController.loginUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);

router.get('/admins', userController.getAdminsOnly);

router.get('/', userController.getAllUsers);

//router.get('/:id', userController.getUserById);


module.exports = router; 