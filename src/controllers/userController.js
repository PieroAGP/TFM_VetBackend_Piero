// Importación de servicios
const { getUsers, updateUser, insertUser, deleteUser, loginUser, getAdmins} = require('../services/userServices');
const { createUserValidations, updateUserValidations, getUserValidations, loginValidations } = require('../validations/userValidations');

const jwt = require('jsonwebtoken');

const userController = {
    // Obtener todos los usuarios
    getAllUsers: [
        async (req, response) => {
        try {
        const { rol } = req.query;
        const filtro = rol ? { rol } : {};
        const data = await getUsers(filtro);
        response.status(200).json(data);
        } catch (e) {
        console.log('Error al recoger usuarios de la BBDD', e);
        response.status(500).json({ error: 'Error al recoger usuarios de la BBDD' });
        }
    }
    ],

    // Crear usuario
    createUser: [
        ...createUserValidations,
        async (req, response) => {
            try {
                const newUser = await insertUser(req.body);
                response.status(201).json(newUser);
            } catch (e) {
                console.log('Error al crear usuario', e);
                response.status(500).json({ error: e.message });
            }
        }
    ],

    // Actualizar usuario
    updateUser: [
        ...updateUserValidations,
        async (req, response) => {
            try {
                const { id } = req.params;
                const userData = req.body;
                const updatedUser = await updateUser(id, userData);
                response.status(200).json(updatedUser);
            } catch (e) {
                console.log('Error al actualizar usuario', e);
                response.status(500).json({ error: 'Error al actualizar usuario' });
            }
        }
    ],

    // Obtener solo administradores
    getAdminsOnly: async (req, res) => {
        try {
            const admins = await getAdmins();
            res.status(200).json(admins);
        } catch (e) {
            console.error('Error al obtener administradores:', e);
            res.status(500).json({ error: 'Error al obtener administradores' });
        }
    },

    // Login de usuario
    loginUser: [
        ...loginValidations,
        async (req, res) => {
            try {
                const { email, password } = req.body;
                const token = await loginUser(email, password);

                // Establecer el token en la cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,  // Cambiar a `true` en producción con HTTPS
                    sameSite: 'Lax', 
                    maxAge: 3600000,  // 1 hora
                    path: '/',
                });

                res.status(200).json({ message: 'Inicio de sesión exitoso', token });
            } catch (error) {
                console.error('Error en el login:', error);
                res.status(401).json({ error: error.message });
            }
        },
    ],
    getSession: async (req, res) => {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: 'No autenticado' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.status(200).json({ user: decoded });
        } catch (err) {
            console.error('Token inválido:', err);
            res.status(401).json({ error: 'Token inválido' });
        }
    },

    logoutUser: async (req, res) => {
        res.clearCookie('token');
        res.status(200).json({ message: 'Sesión cerrada' });
    },
};

module.exports = userController;
