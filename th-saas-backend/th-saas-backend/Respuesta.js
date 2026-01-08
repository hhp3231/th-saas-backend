
// src/models/Respuesta.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Respuesta = sequelize.define('Respuesta', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  empresa_id: { type: DataTypes.INTEGER, allowNull: false },
  pregunta_id: { type: DataTypes.INTEGER, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, allowNull: true },
  area: { type: DataTypes.STRING, allowNull: true },
  valor: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'respuestas' });

module.exports = Respuesta;
