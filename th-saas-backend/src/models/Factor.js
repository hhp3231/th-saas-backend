
// src/models/Factor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Factor = sequelize.define('Factor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  empresa_id: { type: DataTypes.INTEGER, allowNull: false },
  dimension_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'factores' });

module.exports = Factor;
