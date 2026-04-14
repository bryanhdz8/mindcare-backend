require('./Config/database');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const rutasUsuarios = require('./Rutas/usuarios');
const rutaIA = require('./Rutas/ia'); 

app.use('/api/usuarios', rutasUsuarios);
app.use('/api/ia', rutaIA); 

app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});