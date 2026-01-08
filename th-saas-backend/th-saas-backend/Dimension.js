
// src/models/Dimension.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Dimension = sequelize.define('Dimension', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  empresa_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'dimensiones' });

module.exports = Dimension;
