const express = require('express');
const router = express.Router();
const conexion = require('../Config/database');

// --- VALIDACIONES ---
const validarCorreo = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarPassword = (password) => {
  // Regex actualizada para ser más amigable con tus símbolos
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?#]).{8,}$/;
  return regex.test(password);
};

// --- REGISTRO ---
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Completa todos los campos' });
  }

  try {
    // 1. Buscamos en 'usuarios' y 'Email'
    const [resultados] = await conexion.query("SELECT * FROM usuarios WHERE Email = ?", [email]);

    if (resultados.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // 2. Insertamos con los nombres de tus columnas en inglés
    // Nota: Si en Railway no tienes 'apellido' o 'fecha', quítalos de aquí
    const sqlInsert = "INSERT INTO usuarios (Nombre, Email, Password) VALUES (?, ?, ?)";
    await conexion.query(sqlInsert, [nombre, email, password]);

    res.json({ mensaje: 'Usuario guardado con éxito' });
  } catch (err) {
    console.error("Error en Registro:", err.message);
    res.status(500).json({ mensaje: 'Error al registrar' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cambiado a 'usuarios', 'Email' y 'Password'
    const sql = "SELECT * FROM usuarios WHERE Email = ? AND Password = ?";
    const [resultados] = await conexion.query(sql, [email, password]);

    if (resultados.length > 0) {
      res.json({
        mensaje: 'Login correcto',
        usuario: resultados[0]
      });
    } else {
      res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }
  } catch (err) {
    console.error("Error en Login:", err.message);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// --- RECUPERAR CONTRASEÑA ---
router.put('/recuperar-password', async (req, res) => {
  const { email, nuevaPassword } = req.body;
  try {
    const [resultados] = await conexion.query("SELECT * FROM usuarios WHERE Email = ?", [email]);

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    await conexion.query("UPDATE usuarios SET Password = ? WHERE Email = ?", [nuevaPassword, email]);
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar' });
  }
});

module.exports = router;