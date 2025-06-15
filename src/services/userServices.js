const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Crear un nuevo usuario
async function insertUser(userData) {
    try {
        const { email, password, rol, ...restoDatos } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('El email ya está en uso, pilla otro');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = new User({
            ...restoDatos,
            email,
            password: hashedPassword,
            rol: rol || 'usuario',
        });

        const response = await nuevoUsuario.save();
        return response;
    } catch (err) {
        console.error('Error al crear usuario:', err);
        throw err;
    }
}

// Obtener todos los usuarios con posible filtro
async function getUsers(filtro = {}) {
    try {
        const usuarios = await User.find(filtro); 
        return usuarios;
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        throw err;
    }
}

// Actualizar un usuario
async function updateUser(id, userData) {
    try {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const usuarioActualizado = await User.findByIdAndUpdate(
            id,
            userData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!usuarioActualizado) {
            throw new Error('Usuario no encontrado');
        }

        return usuarioActualizado;
    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        throw err;
    }
}

// Eliminar un usuario
async function deleteUser(id) {
    try {
        const usuario = await User.findByIdAndDelete(id);

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        return usuario;
    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        throw err;
    }
}

// Login de usuario
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, rol: user.rol, nombre: user.nombre },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return token;
};

async function getAdmins() {
    try {
        return await User.find({ rol: { $in: ['administrador'] } });
    } catch (err) {
        console.error('Error al obtener administradores:', err);
        throw err;
    }
}

module.exports = {
    insertUser,
    getUsers,
    updateUser,
    deleteUser,
    loginUser,
    getAdmins,
};
