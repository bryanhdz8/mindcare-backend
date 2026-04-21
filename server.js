const express = require('express');
const cors = require('cors');
const conexion = require('./Config/database'); 

const app = express();

// 1. Configuración de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Middlewares para leer JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 3. Importación de Rutas
const rutasUsuarios = require('./Rutas/Usuarios');
const rutaIA = require('./Rutas/ia'); 
const rutasPsicologos = require('./Rutas/Psicologos'); // NUEVA
const rutasCitas = require('./Rutas/Citas');           // NUEVA

// 4. Registro de Rutas
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/ia', rutaIA); 
app.use('/api/psicologos', rutasPsicologos); // NUEVA: Para listar doctores
app.use('/api/citas', rutasCitas);           // NUEVA: Para agendar citas

app.get('/', (req, res) => {
  res.send('Servidor MindCare funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});