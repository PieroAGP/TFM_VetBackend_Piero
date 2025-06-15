const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const servicioRouter = require('./routes/servicioRouters');
const mascotaRouter = require('./routes/mascotaRoutes');
const citaRouter = require('./routes/citaRoutes');

const cookieParser = require('cookie-parser');


const errorHandler = require('./middlewares/errorMiddleware');
const notFoundHandler = require('./middlewares/notFoundHandler');
const cors = require('cors');
const helmet = require('helmet');
// Protección con límite de peticiones por IP
const rateLimit = require('express-rate-limit');
// Protección contra consultas NoSQL maliciosas (inyección)
//*COMENTAR */
//const mongooseSanitize = require('mongoose-sanitize');

const app = express();

// Middleware para parsear JSON
app.use(express.json());// Devuelve un middleware

// Evitar conflictos CORS
const corsOptions = {
  origin: [
    'http://localhost:3000/', // Para desarrollo local
    'https://tfmvetfrontpiero-production.up.railway.app/', // URL de tu frontend en Railway
    // Agrega otras URLs si tienes múltiples dominios
  ],
  credentials: true, // Si necesitas cookies/auth
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(cookieParser());

// Protección en cabeceras y otros
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);


// Protección contra consulta maliciosas
/*COMENTAR*/
//app.use(mongooseSanitize());

// Ejemplo de ataque prevenido:
// Un atacante envía: { "email": { "$ne": "" }, "password": "123" }
// Se convierte en: { "email": {}, "password": "123" }

const apiLimiter = rateLimit({ // ESTO SE LLAMA LIMITADOR 
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 peticiones por IP
    message: 'Demasiadas peticiones desde esta IP'
});

//Toda mi API queda protegida de peticiones recurrentes excesivas
app.use('/', apiLimiter);
  
// Montamos las rutas en diferentes paths base
app.use('/users', userRoutes);     // Todas las rutas de usuarios empezarán con /users
app.use('/servicios', servicioRouter);
app.use('/mascotas', mascotaRouter);
app.use('/citas', citaRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Manejador de rutas no encontradas
app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;