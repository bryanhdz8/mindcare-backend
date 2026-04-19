const express = require('express');
const router = express.Router();
const conexion = require('../Config/database');

// --- TUS VALIDACIONES ORIGINALES (Se mantienen igual) ---
const validarCorreo = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

// --- REGISTRO (Lógica original con CURDATE() y estado 'activa') ---
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Completa todos los campos' });
  }

  if (!validarCorreo(email)) {
    return res.status(400).json({ mensaje: 'Correo inválido' });
  }

  if (!validarPassword(password)) {
    return res.status(400).json({
      mensaje: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'
    });
  }

  try {
    const sqlBuscar = "SELECT * FROM USUARIO WHERE correo = ?";
    const [resultados] = await conexion.query(sqlBuscar, [email]);

    if (resultados.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const sqlInsert = `
      INSERT INTO USUARIO (nombre, apellido, correo, contrasena, fecha_registro, estado_cuenta)
      VALUES (?, ?, ?, ?, CURDATE(), ?)
    `;

    await conexion.query(sqlInsert, [nombre, '', email, password, 'activa']);
    res.json({ mensaje: 'Usuario guardado en la base de datos' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// --- LOGIN (Lógica original) ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Completa todos los campos' });
  }

  try {
    const sql = "SELECT * FROM USUARIO WHERE correo = ? AND contrasena = ?";
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
    console.log(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// --- RECUPERAR CONTRASEÑA ---
router.put('/recuperar-password', async (req, res) => {
  const { email, nuevaPassword } = req.body;

  try {
    const sqlBuscar = "SELECT * FROM USUARIO WHERE correo = ?";
    const [resultados] = await conexion.query(sqlBuscar, [email]);

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const sqlUpdate = "UPDATE USUARIO SET contrasena = ? WHERE correo = ?";
    await conexion.query(sqlUpdate, [nuevaPassword, email]);
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar' });
  }
});

// --- CAMBIAR CONTRASEÑA (Lógica de seguridad original) ---
router.put('/password', async (req, res) => {
  const { email, passwordActual, passwordNueva } = req.body;

  if (!email || !passwordActual || !passwordNueva) {
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  if (!validarPassword(passwordNueva)) {
    return res.status(400).json({
      mensaje: 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'
    });
  }

  try {
    const [resultados] = await conexion.query("SELECT * FROM USUARIO WHERE correo = ?", [email]);

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (resultados[0].contrasena !== passwordActual) {
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    await conexion.query("UPDATE USUARIO SET contrasena = ? WHERE correo = ?", [passwordNueva, email]);
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// --- RUTA EXTRA PARA EL PERFIL (Para que el botón Guardar funcione) ---
router.put('/actualizar', async (req, res) => {
  const { email, nombre } = req.body;
  try {
    await conexion.query("UPDATE USUARIO SET nombre = ? WHERE correo = ?", [nombre, email]);
    res.json({ mensaje: 'Perfil actualizado' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar nombre' });
  }
});

module.exports = router;
// Cambio para forzar subida