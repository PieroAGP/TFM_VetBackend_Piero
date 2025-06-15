const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const servicioRouter = require("./routes/servicioRouters");
const mascotaRouter = require("./routes/mascotaRoutes");
const citaRouter = require("./routes/citaRoutes");

const cookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorMiddleware");
const notFoundHandler = require("./middlewares/notFoundHandler");
const cors = require("cors");
const helmet = require("helmet");
// Protección con límite de peticiones por IP
const rateLimit = require("express-rate-limit");
// Protección contra consultas NoSQL maliciosas (inyección)
//*COMENTAR */
//const mongooseSanitize = require('mongoose-sanitize');

const app = express();

// Evitar conflictos CORS
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://tfmvetfrontpiero-production.up.railway.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// APLICAR CORS
app.use(cors(corsOptions));

// MANEJO EXPLÍCITO DE PREFLIGHT (CRÍTICO)
app.options("*", (req, res) => {
  console.log("🔄 Preflight request recibida:", req.method, req.url);
  console.log("🌐 Origin:", req.headers.origin);

  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "3600"); // Cache preflight por 1 hora

  console.log("✅ Preflight response enviada");
  res.sendStatus(200);
});

// MIDDLEWARE ADICIONAL PARA HEADERS
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Solo permitir orígenes específicos
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://tfmvetfrontpiero-production.up.railway.app",
  ];

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");

  console.log(`📍 ${req.method} ${req.url} from ${origin}`);
  next();
});
app.use(cookieParser());

// Protección en cabeceras y otros
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Middleware para parsear JSON
app.use(express.json()); // Devuelve un middleware
app.get("/", (req, res) => {
  res.json({
    message: "Veterinaria API funcionando!",
    status: "OK",
    mongodb:
      mongoose.connection.readyState === 1 ? "conectado" : "desconectado",
  });
});

// Ruta de health check adicional
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Protección contra consulta maliciosas
/*COMENTAR*/
//app.use(mongooseSanitize());

// Ejemplo de ataque prevenido:
// Un atacante envía: { "email": { "$ne": "" }, "password": "123" }
// Se convierte en: { "email": {}, "password": "123" }

const apiLimiter = rateLimit({
  // ESTO SE LLAMA LIMITADOR
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP
  message: "Demasiadas peticiones desde esta IP",
});

//Toda mi API queda protegida de peticiones recurrentes excesivas
app.use("/", apiLimiter);

// Montamos las rutas en diferentes paths base
app.use("/users", userRoutes); // Todas las rutas de usuarios empezarán con /users
app.use("/servicios", servicioRouter);
app.use("/mascotas", mascotaRouter);
app.use("/citas", citaRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Manejador de rutas no encontradas
app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
