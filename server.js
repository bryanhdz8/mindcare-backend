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

// 2. ¡ESTAS LÍNEAS FALTABAN! (Indispensables para leer lo que envía el celular)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// 3. Ahora sí, las rutas (siempre después de los lectores de JSON)
const rutasUsuarios = require('./Rutas/Usuarios');
const rutaIA = require('./Rutas/ia'); 

app.use('/api/usuarios', rutasUsuarios);
app.use('/api/ia', rutaIA); 

app.get('/', (req, res) => {
  res.send('Servidor MindCare funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});