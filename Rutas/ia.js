const express = require('express');
const router = express.Router();

// Memoria simple por usuario (en memoria del servidor)
const memoria = {};

const respuestas = {
  estres: [
    "Parece que estás bajo mucha presión. Es completamente comprensible en tu entorno. ¿Te ayudaría hacer una pausa breve para respirar profundo?",
    "El estrés puede acumularse rápido en tu trabajo. Intenta enfocarte en una sola tarea a la vez y darte pequeños descansos.",
    "Estás haciendo lo mejor que puedes. Recuerda que también necesitas cuidarte a ti mismo."
  ],
  tristeza: [
    "Lamento que te sientas así. Tus emociones son totalmente válidas. ¿Quieres contarme qué pasó?",
    "A veces cargar con tantas cosas puede pesar mucho. Estoy aquí para escucharte.",
    "No estás solo. Hablarlo ya es un paso muy importante."
  ],
  cansancio: [
    "El agotamiento que sientes es una señal de que tu cuerpo necesita descanso.",
    "Tu trabajo es exigente, es normal sentirse así. ¿Has podido dormir bien últimamente?",
    "Date permiso de parar un momento. Tu bienestar también importa."
  ],
  ansiedad: [
    "La ansiedad puede sentirse muy intensa. Intenta respirar lento: inhala 4 segundos, exhala 4 segundos.",
    "Estoy contigo. Vamos paso a paso. ¿Qué es lo que más te preocupa ahora?",
    "Enfocarte en el presente puede ayudarte. ¿Qué puedes controlar en este momento?"
  ],
  default: [
    "Estoy aquí para escucharte. Cuéntame un poco más.",
    "Entiendo. ¿Cómo te hace sentir eso exactamente?",
    "Puedes expresarte con confianza aquí."
  ]
};

function detectarTipo(texto) {
  texto = texto.toLowerCase();

  if (texto.includes('estres')) return 'estres';
  if (texto.includes('triste')) return 'tristeza';
  if (texto.includes('ansiedad') || texto.includes('ansioso')) return 'ansiedad';
  if (texto.includes('cansado') || texto.includes('agotado')) return 'cansancio';

  return 'default';
}

function generarRespuesta(tipo, mensaje, historial = []) {
  const lista = respuestas[tipo];
  let respuesta = lista[Math.floor(Math.random() * lista.length)];

  if (historial.length > 1) {
    respuesta += " También noto que has estado compartiendo varias cosas importantes. Gracias por confiar en este espacio.";
  }

  if (mensaje.length > 40) {
    respuesta += " Se nota que estás expresando algo importante.";
  }

  return respuesta;
}

router.post('/', (req, res) => {
  const { mensaje, usuario = "default" } = req.body;

  if (!memoria[usuario]) {
    memoria[usuario] = [];
  }

  memoria[usuario].push(mensaje);

  const tipo = detectarTipo(mensaje);
  const respuesta = generarRespuesta(tipo, mensaje, memoria[usuario]);

  setTimeout(() => {
    res.json({ respuesta });
  }, 1000 + Math.random() * 1000);
});

module.exports = router;