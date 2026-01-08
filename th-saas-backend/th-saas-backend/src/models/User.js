
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  empresa_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  cedula: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: {
    type: DataTypes.ENUM("admin", "analista", "empleado"),
    defaultValue: "empleado"
  },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: "users"
});

module.exports = User;
