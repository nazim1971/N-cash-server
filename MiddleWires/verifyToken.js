// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

app.use(cookieParser()); // Initialize cookie-parser middleware

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: 'Unauthorized access' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized access' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
