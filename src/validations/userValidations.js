const { body, param, validationResult } = require('express-validator');

// Función de validación de resultados
const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validaciones para crear usuario
const createUserValidations = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isString()
        .withMessage('El nombre debe ser texto'),

    body('email')
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Debe ser un email válido'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),

    body('rol')
        .optional()
        .isIn(['usuario', 'absoluteAdmin', 'administrador'])
        .withMessage('El rol debe ser usuario, administrador u organizador'),

    body('edad')
        .optional()
        .isNumeric()
        .withMessage('La edad debe ser un número')
        .custom(value => {
            if (value < 0) throw new Error('La edad no puede ser negativa');
            return true;
        }),

    body('ubicacion')
        .optional()
        .isString()
        .withMessage('La ubicación debe ser texto'),

    validateResult
];

// Validaciones para actualizar usuario
const updateUserValidations = [
    param('id')
        .notEmpty()
        .withMessage('El ID es requerido')
        .isMongoId()
        .withMessage('Debe ser un ID de MongoDB válido'),

    body('nombre')
        .optional()
        .isString()
        .withMessage('El nombre debe ser texto'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Debe ser un email válido'),

    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),

    body('rol')
        .optional()
        .isIn(['usuario', 'absoluteAdmin', 'administrador'])
        .withMessage('El rol debe ser usuario, administrador u organizador'),

    body('edad')
        .optional()
        .isNumeric()
        .withMessage('La edad debe ser un número')
        .custom(value => {
            if (value < 0) throw new Error('La edad no puede ser negativa');
            return true;
        }),

    body('ubicacion')
        .optional()
        .isString()
        .withMessage('La ubicación debe ser texto'),

    validateResult
];

// Validaciones para obtener usuario por ID
const getUserValidations = [
    param('id')
        .notEmpty()
        .withMessage('El ID es requerido')
        .isMongoId()
        .withMessage('Debe ser un ID de MongoDB válido'),
    validateResult
];

// Validaciones para login
const loginValidations = [
    body('email')
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Debe ser un email válido'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),

    validateResult
];

module.exports = {
    createUserValidations,
    updateUserValidations,
    getUserValidations,
    loginValidations,
};
