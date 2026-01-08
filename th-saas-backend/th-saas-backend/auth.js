
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, empresa_id, rol }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
