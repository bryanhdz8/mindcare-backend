const mysql = require('mysql2');

// Usamos createPool en lugar de createConnection para manejar mejor múltiples usuarios
const conexion = mysql.createPool({
  // 👇 Intentamos leer de las variables de Render, si no existen, usa lo que pusiste
  host: process.env.DB_HOST || 'monorail.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'YCDnSKfeiWnbxjShnbaxdzmNNWiJhfHO',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 50884,
  
  // 🛡️ ESTO ES LO QUE FALTA: Railway requiere SSL para conexiones externas
  ssl: {
    rejectUnauthorized: false
  },
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// En un Pool no se usa .connect(), se verifica así:
conexion.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
  } else {
    console.log('✅ Conectado a Railway mediante Pool 🚀');
    conn.release(); // Liberar la conexión de prueba
  }
});

module.exports = conexion.promise(); // .promise() te permite usar async/await en tus rutas