
// src/models/Umbral.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Umbral = sequelize.define('Umbral', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  empresa_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  rojo_max: { type: DataTypes.FLOAT, defaultValue: 2.25 },
  amarillo_max: { type: DataTypes.FLOAT, defaultValue: 3.0 },
  verde_claro_max: { type: DataTypes.FLOAT, defaultValue: 3.5 }
}, { tableName: 'umbrales' });

module.exports = Umbral;
