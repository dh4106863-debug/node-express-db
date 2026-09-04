//Carga de variables de entorno
require('dotenv').config();
const express = require('express');
const path = require('path');

//Importación de middlewares y enrutadores
const { sequelize } = require('./src/models');
const loggerMiddleware = require('./src/middlewares/logger.middleware');
const mainRoutes = require('./src/routes/main.routes');

const app = express();
const PORT = process.env.PORT || 3000;

//Configuración del motor de plantillas vistas
app.set('views', path.join(__dirname, 'views'));

//Middleware para parseo de JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware para archivos estáticos desde /public
app.use(express.static(path.join(__dirname, './public')));

//Middleware global de registros (logs)
app.use(loggerMiddleware);

//Conexión de rutas principales
app.use('/', mainRoutes);

sequelize.sync() //Sincronizar tablas sin borrar datos existentes
  .then(() => {
    console.log(' Base de datos conectada y tablas sincronizadas correctamente.');
    app.listen(PORT, () => {
      console.log(` Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(' Error al conectar la base de datos:', err));