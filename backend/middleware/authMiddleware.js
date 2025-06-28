const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Obtener el token del encabezado de autorización
  const authHeader = req.header('Authorization');

  // Verificar si no hay token o si el formato es incorrecto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada.' });
  }
  
  try {
    // Extraer el token del encabezado "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Verificar el token usando el secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Añadir el payload del usuario decodificado al objeto request
    // para que las rutas protegidas puedan acceder a él (ej. req.user.id)
    req.user = decoded.user;
    next(); // Pasar al siguiente middleware o controlador de ruta
  } catch (err) {
    res.status(401).json({ msg: 'El token no es válido.' });
  }
}

module.exports = authMiddleware;
