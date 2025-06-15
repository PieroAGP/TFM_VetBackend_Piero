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

// Evitar conflictos CORS
const corsOptions = {
  origin: true, // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Access-Control-Allow-Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};
//app.use(cors(corsOptions));

app.use((req, res, next) => {
  const allowedOrigins = [
    'https://tfmvetfrontpiero-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Middleware adicional para manejar preflight requests manualmente si es necesario
/*
app.use((req, res, next) => {
  // Permitir todos los orígenes para preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, X-Access-Token');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});
*/
app.use(cookieParser());

// Protección en cabeceras y otros
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);


// Middleware para parsear JSON
app.use(express.json());// Devuelve un middleware
app.get('/', (req, res) => {
  res.json({ 
    message: 'Veterinaria API funcionando!',
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado'
  });
});



// Ruta de health check adicional
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});



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