const mysql = require('mysql2');

// 🔥 CONEXIÓN A RAILWAY (TU BASE DE DATOS EN LA NUBE)
const conexion = mysql.createConnection({
  host: 'monorail.proxy.rlwy.net',
  user: 'root',
  password: 'YCDnSKfeiWnbxjShnbaxdzmNNWiJhfHO', // ← pega aquí tu contraseña real
  database: 'railway',
  port: 50884
});

// 🔌 CONECTAR
conexion.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
    return;
  }
  console.log('✅ Conectado a Railway 🚀');
});

module.exports = conexion;