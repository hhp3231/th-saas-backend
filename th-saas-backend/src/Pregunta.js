
// src/models/Pregunta.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pregunta = sequelize.define('Pregunta', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  empresa_id: { type: DataTypes.INTEGER, allowNull: false },
  factor_id: { type: DataTypes.INTEGER, allowNull: false },
  texto: { type: DataTypes.TEXT, allowNull: false },
  escala_min: { type: DataTypes.INTEGER, defaultValue: 1 },
  escala_max: { type: DataTypes.INTEGER, defaultValue: 4 }
}, { tableName: 'preguntas' });

module.exports = Pregunta;
