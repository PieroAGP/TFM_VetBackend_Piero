require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const port = process.env.PORT; // Tendrá que depender de la variable de entorno

// Función principal asíncrona
const startServer = async () => {
    try {
        //Conexión con la base de datos 
        await connectDB();

        //Levantamos el servidor
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });

    } catch(error) {
        console.log('No se ha podido levantar el servidor', error);
        process.exit(1);
    }
}

startServer();
