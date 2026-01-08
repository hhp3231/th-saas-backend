
// src/routes/clima.routes.js
const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');

const auth = require('../middleware/auth');
const sequelize = require('../config/db');
const Dimension = require('../models/Dimension');
const Factor = require('../models/Factor');
const Pregunta = require('../models/Pregunta');
const Respuesta = require('../models/Respuesta');
const Umbral = require('../models/Umbral');

// Sincronizar modelos al cargar
(async () => {
  try {
    await Dimension.sync();
    await Factor.sync();
    await Pregunta.sync();
    await Respuesta.sync();
    await Umbral.sync();
    console.log('Modelos de Clima sincronizados ✅');
  } catch (err) { console.error(err); }
})();

// Utilidad: color según umbrales
async function colorPorValor(empresa_id, v) {
  const umb = await Umbral.findOne({ where: { empresa_id } });
  const rojoMax = umb?.rojo_max ?? 2.25;
  const amarilloMax = umb?.amarillo_max ?? 3.0;
  const verdeClaroMax = umb?.verde_claro_max ?? 3.5;
  if (v <= rojoMax) return 'rojo';
  if (v <= amarilloMax) return 'amarillo';
  if (v <= verdeClaroMax) return 'verde_claro';
  return 'verde';
}

// --- Umbrales ---
router.post('/umbrales', auth, async (req, res) => {
  try {
    const { empresa_id, rojo_max, amarillo_max, verde_claro_max } = req.body;
    if (!empresa_id) return res.status(400).json({ message: 'empresa_id requerido' });
    const [u, created] = await Umbral.upsert({ empresa_id, rojo_max, amarillo_max, verde_claro_max }, { returning: true });
    res.json({ message: 'Umbrales configurados', created });
  } catch (err) { res.status(500).json({ message: 'Error umbrales', error: String(err) }); }
});

// --- Dimensiones ---
router.post('/dimensiones', auth, async (req, res) => {
  try {
    const { empresa_id, lista } = req.body;
    if (!empresa_id || !Array.isArray(lista)) return res.status(400).json({ message: 'empresa_id y lista requeridos' });
    const out = [];
    for (const d of lista) {
      const row = await Dimension.create({ empresa_id, nombre: d.nombre });
      out.push({ id: row.id, nombre: row.nombre });
    }
    res.json({ message: 'Dimensiones cargadas', count: out.length, dimensiones: out });
  } catch (err) { res.status(500).json({ message: 'Error dimensiones', error: String(err) }); }
});

// --- Factores ---
router.post('/factores', auth, async (req, res) => {
  try {
    const { empresa_id, lista } = req.body;
    if (!empresa_id || !Array.isArray(lista)) return res.status(400).json({ message: 'empresa_id y lista requeridos' });
    const out = [];
    for (const f of lista) {
      const row = await Factor.create({ empresa_id, dimension_id: f.dimension_id, nombre: f.nombre });
      out.push({ id: row.id, nombre: row.nombre });
    }
    res.json({ message: 'Factores cargados', count: out.length, factores: out });
  } catch (err) { res.status(500).json({ message: 'Error factores', error: String(err) }); }
});

// --- Preguntas ---
router.post('/preguntas', auth, async (req, res) => {
  try {
    const { empresa_id, lista } = req.body;
    if (!empresa_id || !Array.isArray(lista)) return res.status(400).json({ message: 'empresa_id y lista requeridos' });
    const out = [];
    for (const p of lista) {
      const row = await Pregunta.create({ empresa_id, factor_id: p.factor_id, texto: p.texto, escala_min: p.escala_min ?? 1, escala_max: p.escala_max ?? 4 });
      out.push({ id: row.id, texto: row.texto });
    }
    res.json({ message: 'Preguntas cargadas', count: out.length, preguntas: out });
  } catch (err) { res.status(500).json({ message: 'Error preguntas', error: String(err) }); }
});

// --- Respuestas (masivo) ---
router.post('/respuestas', auth, async (req, res) => {
  try {
    const { empresa_id, lista } = req.body;
    if (!empresa_id || !Array.isArray(lista)) return res.status(400).json({ message: 'empresa_id y lista requeridos' });
    const out = [];
    for (const r of lista) {
      const row = await Respuesta.create({ empresa_id, pregunta_id: r.pregunta_id, usuario_id: r.usuario_id ?? null, area: r.area ?? null, valor: r.valor, fecha: r.fecha ?? new Date() });
      out.push({ id: row.id });
    }
    res.json({ message: 'Respuestas registradas', count: out.length });
  } catch (err) { res.status(500).json({ message: 'Error respuestas', error: String(err) }); }
});

// --- Indicadores (preguntas, factores, dimensiones) ---
router.get('/indicadores', auth, async (req, res) => {
  try {
    const empresa_id = parseInt(req.query.empresa_id);
    if (!empresa_id) return res.status(400).json({ message: 'empresa_id requerido' });

    // Preguntas
    const preguntas = await sequelize.query(
      `SELECT p.id as pregunta_id, p.texto, ROUND(AVG(r.valor)::numeric, 2) AS promedio
       FROM preguntas p
       JOIN respuestas r ON r.pregunta_id = p.id AND r.empresa_id = p.empresa_id
       WHERE p.empresa_id = :empresa_id
       GROUP BY p.id, p.texto
       ORDER BY p.id`,
      { replacements: { empresa_id }, type: QueryTypes.SELECT }
    );

    // Factores
    const factores = await sequelize.query(
      `SELECT f.id as factor_id, f.nombre, ROUND(AVG(r.valor)::numeric, 2) AS promedio
       FROM factores f
       JOIN preguntas p ON p.factor_id = f.id AND p.empresa_id = f.empresa_id
       JOIN respuestas r ON r.pregunta_id = p.id AND r.empresa_id = f.empresa_id
       WHERE f.empresa_id = :empresa_id
       GROUP BY f.id, f.nombre
       ORDER BY f.id`,
      { replacements: { empresa_id }, type: QueryTypes.SELECT }
    );

    // Dimensiones
    const dimensiones = await sequelize.query(
      `SELECT d.id as dimension_id, d.nombre, ROUND(AVG(r.valor)::numeric, 2) AS promedio
       FROM dimensiones d
       JOIN factores f ON f.dimension_id = d.id AND f.empresa_id = d.empresa_id
       JOIN preguntas p ON p.factor_id = f.id AND p.empresa_id = d.empresa_id
       JOIN respuestas r ON r.pregunta_id = p.id AND r.empresa_id = d.empresa_id
       WHERE d.empresa_id = :empresa_id
       GROUP BY d.id, d.nombre
       ORDER BY d.id`,
      { replacements: { empresa_id }, type: QueryTypes.SELECT }
    );

    // Añadir color según umbrales
    for (const arr of [preguntas, factores, dimensiones]) {
      for (const item of arr) {
        item.color = await colorPorValor(empresa_id, parseFloat(item.promedio));
      }
    }

    res.json({ preguntas, factores, dimensiones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error indicadores', error: String(err) });
  }
});

module.exports = router;
