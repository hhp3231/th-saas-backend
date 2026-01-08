
const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Healthcheck
app.get("/", (req, res) => {
  res.send("Servidor RRHH online ✅");
});

// Rutas de autenticación
const authRoutes = require("./src/routes/auth.routes");
app.use("/api/auth", authRoutes);

// (Opcional) estáticos
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});

module.exports = app;
