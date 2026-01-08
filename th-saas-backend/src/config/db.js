
const { Sequelize } = require("sequelize");

// La URL de la base viene de las Variables de Railway
const connectionString = process.env.DATABASE_URL;

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});

module.exports = sequelize;
