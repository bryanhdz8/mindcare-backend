const express = require('express');
const router = express.Router();
const conexion = require('../Config/database');

// --- VALIDACIONES ---
const validarCorreo = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarPassword = (password) => {
  // Acepta mayúsculas, números y símbolos (como el # que usas)
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?#]).{8,}$/;
  return regex.test(password);
};

// --- 1. REGISTRO ---
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Completa todos los campos' });
  }

  try {
    const [resultados] = await conexion.query("SELECT * FROM usuarios WHERE Email = ?", [email]);

    if (resultados.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const sqlInsert = "INSERT INTO usuarios (Nombre, Email, Password) VALUES (?, ?, ?)";
    await conexion.query(sqlInsert, [nombre, email, password]);

    res.json({ mensaje: 'Usuario guardado con éxito' });
  } catch (err) {
    console.error("Error en Registro:", err.message);
    res.status(500).json({ mensaje: 'Error al registrar' });
  }
});

// --- 2. LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
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

// --- 3. RECUPERAR CONTRASEÑA (Desde fuera del app) ---
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
    console.error("Error en Recuperar:", err.message);
    res.status(500).json({ mensaje: 'Error al actualizar' });
  }
});

// --- 4. CAMBIAR CONTRASEÑA (Desde el Perfil/Seguridad) ---
router.put('/password', async (req, res) => {
  const { email, passwordActual, passwordNueva } = req.body;

  if (!email || !passwordActual || !passwordNueva) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  if (!validarPassword(passwordNueva)) {
    return res.status(400).json({
      mensaje: 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo'
    });
  }

  try {
    const [resultados] = await conexion.query("SELECT * FROM usuarios WHERE Email = ?", [email]);

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificamos que la contraseña actual coincida con la de la DB
    if (resultados[0].Password !== passwordActual) {
      return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    await conexion.query("UPDATE usuarios SET Password = ? WHERE Email = ?", [passwordNueva, email]);
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error("Error en Cambio Perfil:", err.message);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// --- ACTUALIZAR PERFIL COMPLETO ---
router.put('/actualizar', async (req, res) => {
  const { email, nombre, rol, edad } = req.body; 
  
  try {
    // IMPORTANTE: Los nombres (Nombre, rol, edad, Email) deben coincidir exactos con Railway
    const sql = "UPDATE usuarios SET Nombre = ?, rol = ?, edad = ? WHERE Email = ?";
    await conexion.query(sql, [nombre, rol, edad, email]);
    
    res.json({ mensaje: 'Perfil actualizado correctamente en la nube' });
  } catch (err) {
    console.error("Error al actualizar perfil:", err.message);
    res.status(500).json({ mensaje: 'Error al actualizar', detalle: err.message });
  }
});

module.exports = router;