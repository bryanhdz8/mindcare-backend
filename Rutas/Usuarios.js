const express = require('express');
const router = express.Router();
const conexion = require('../Config/database');

// REGISTRO
router.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body;

  // CORRECCIÓN: Usamos los nombres exactos de tus columnas en Railway
  const sql = "INSERT INTO usuarios (Nombre, Email, Password) VALUES (?, ?, ?)";

  conexion.query(sql, [nombre, email, password], (err, resultado) => {
    if (err) {
      console.log("❌ Error en registro:", err);
      return res.status(500).json({
        mensaje: "Error al registrar usuario"
      });
    }

    res.json({
      mensaje: "Usuario guardado en la base de datos"
    });
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // CORRECCIÓN: Buscamos por Email y Password con mayúscula
  const sql = "SELECT * FROM usuarios WHERE Email = ? AND Password = ?";

  conexion.query(sql, [email, password], (err, resultados) => {
    if (err) {
      console.log("❌ Error en login:", err);
      return res.status(500).json({
        mensaje: "Error en el servidor"
      });
    }

    if (resultados.length > 0) {
      res.json({
        mensaje: "Login correcto",
        usuario: resultados[0]
      });
    } else {
      res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }
  });
});

// CAMBIAR CONTRASEÑA 
router.put('/password', (req, res) => {
  const { email, passwordActual, passwordNueva } = req.body;

  if (!email || !passwordActual || !passwordNueva) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  // 1. Buscar usuario por Email (Mayúscula)
  const sqlBuscar = "SELECT * FROM usuarios WHERE Email = ?";

  conexion.query(sqlBuscar, [email], (err, resultados) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = resultados[0];

    // 2. Validar contraseña actual (Asegurándonos que use la P mayúscula de la DB)
    if (usuario.Password !== passwordActual) {
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    // 3. Actualizar contraseña
    const sqlUpdate = "UPDATE usuarios SET Password = ? WHERE Email = ?";

    conexion.query(sqlUpdate, [passwordNueva, email], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ mensaje: 'Error al actualizar' });
      }

      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
  });
});

module.exports = router;