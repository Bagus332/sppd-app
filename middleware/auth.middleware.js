const jwt = require('jsonwebtoken');
const config = require('../db.config');

verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  const tokenString = token.replace('Bearer ', '');

  jwt.verify(tokenString, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authMiddleware = {
  verifyToken
};

module.exports = authMiddleware;