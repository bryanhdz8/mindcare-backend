const express = require('express');
const router = express.Router();
const conexion = require('../Config/database');

// REGISTRO
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  // IMPORTANTE: Nombre, Email y Password con mayúscula inicial
  const sql = "INSERT INTO usuarios (Nombre, Email, Password) VALUES (?, ?, ?)";

  try {
    await conexion.query(sql, [nombre, email, password]);
    res.json({ mensaje: "Usuario guardado en la base de datos" });
  } catch (err) {
    console.error("❌ Error en registro:", err);
    res.status(500).json({ mensaje: "Error al registrar usuario", error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE Email = ? AND Password = ?";

  try {
    const [resultados] = await conexion.query(sql, [email, password]);
    if (resultados.length > 0) {
      res.json({ mensaje: "Login correcto", usuario: resultados[0] });
    } else {
      res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

module.exports = router;