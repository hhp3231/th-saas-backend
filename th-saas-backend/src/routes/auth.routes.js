
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sequelize = require("../config/db");
const User = require("../models/User");

// Inicializar DB y tabla
(async () => {
  try {
    await sequelize.authenticate();
    await User.sync(); // crea tabla si no existe
    console.log("DB lista y modelo User sincronizado ✅");
  } catch (err) {
    console.error("Error al conectar DB:", err);
  }
})();

/**
 * Precarga masiva de usuarios (desde JSON)
 * Body: [{empresa_id, nombre, email, cedula, rol}]
 * Contraseña inicial = cédula (cifrada en bcrypt)
 */
router.post("/seed", async (req, res) => {
  try {
    const lista = req.body;
    if (!Array.isArray(lista) || lista.length === 0) {
      return res.status(400).json({ message: "Se requiere lista de usuarios" });
    }

    const resultados = [];
    for (const u of lista) {
      const hashed = await bcrypt.hash(u.cedula, 10);
      const created = await User.create({
        empresa_id: u.empresa_id,
        nombre: u.nombre,
        email: u.email.toLowerCase(),
        cedula: u.cedula,
        password: hashed,
        rol: u.rol || "empleado"
      });
      resultados.push({ id: created.id, email: created.email });
    }

    res.json({ message: "Usuarios precargados", count: resultados.length, resultados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al precargar usuarios" });
  }
});

/**
 * Login
 * Body: { email, password, empresa_id }
 * Devuelve: token JWT, rol, empresa_id
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, empresa_id } = req.body;

    if (!email || !password || !empresa_id) {
      return res.status(400).json({ message: "Faltan datos: email, password, empresa_id" });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase(), empresa_id, activo: true } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(403).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user.id, empresa_id: user.empresa_id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login correcto",
      token,
      rol: user.rol,
      empresa_id: user.empresa_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});

module.exports = router;
