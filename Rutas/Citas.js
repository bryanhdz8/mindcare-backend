const express = require('express');
const router = express.Router();
const db = require('../Config/database');

// Registrar una nueva cita
router.post('/agendar', async (req, res) => {
    const { paciente_id, psicologo_id, fecha_hora } = req.body;
    
    try {
        const query = `
            INSERT INTO citas (paciente_id, psicologo_id, fecha_hora, estado) 
            VALUES (?, ?, ?, 'Pendiente')
        `;
        const [result] = await db.query(query, [paciente_id, psicologo_id, fecha_hora]);
        res.json({ mensaje: "Cita agendada correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al agendar la cita" });
    }
});

module.exports = router;