const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('No se encontro el token');
    return res.status(401).json({ message: 'No se encontro tu token de sesion, acceso denegado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Por alguna razon el token no es valido' });
  }
};

module.exports = authMiddleware;