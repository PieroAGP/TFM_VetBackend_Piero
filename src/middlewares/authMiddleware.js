const jwt = require('jsonwebtoken');

const verifyToken = (rolesPermitidos = []) => (req, res, next) => {
  // Obtener el token desde cookies o encabezado Authorization
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  //console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    req.user = decoded; // Inyectamos info del usuario en el request

    // Verificación de roles si aplica
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.role)) {
      return res.status(403).json({ message: 'No tienes permiso para esta acción' });
    }

    next(); // Autenticación y autorización exitosas
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { verifyToken };
