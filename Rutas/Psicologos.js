const express = require('express');
const router = express.Router();
const db = require('../Config/database');

// Obtener lista de psicólogos con su perfil profesional
router.get('/disponibles', async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.Nombre, u.rol, p.especialidad, p.precio_sesion, p.descripcion 
            FROM usuarios u 
            INNER JOIN perfil_psicologo p ON u.id = p.usuario_id 
            WHERE u.rol = 'Psicólogo/a'
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener psicólogos" });
    }
});

module.exports = router;