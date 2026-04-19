const express = require('express');
const cors = require('cors');
// Movemos la conexión para asegurarnos de que cargue bien
const conexion = require('./Config/database'); 

const app = express();

// Configuración de CORS más robusta
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas
const rutasUsuarios = require('./Rutas/Usuarios');
const rutaIA = require('./Rutas/ia'); 

app.use('/api/usuarios', rutasUsuarios);
app.use('/api/ia', rutaIA); 

app.get('/', (req, res) => {
  res.send('Servidor MindCare funcionando');
});

// Importante: '0.0.0.0' es clave en Render para que sea accesible externamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});