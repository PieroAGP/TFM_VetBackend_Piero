require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Función principal asíncrona
const startServer = async () => {
  try {
    //Conexión con la base de datos
    await connectDB();
    const port = process.env.PORT; // Tendrá que depender de la variable de entorno
    //Levantamos el servidor
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`✅ MongoDB conectado correctamente`);
    });
  } catch (error) {
    console.log("No se ha podido levantar el servidor", error);
    process.exit(1);
  }
};

startServer();
