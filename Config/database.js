const mysql = require('mysql2');

const conexion = mysql.createPool({
  host: process.env.DB_HOST || 'monorail.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'YCDnSKfeiWnbxjShnbaxdzmNNWiJhfHO',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 50884,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = conexion.promise();