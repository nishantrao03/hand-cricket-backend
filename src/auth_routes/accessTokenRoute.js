// routes/accessTokenRoute.js
const express = require('express');
const jwt = require('jsonwebtoken');
// require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // your JWT secret
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

router.get('/access-token', (req, res) => {
  console.log("Checking access token...");
  const accessToken = req.cookies.access_token;
  console.log("Access Token from cookie:", accessToken);

  if (!accessToken) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  jwt.verify(accessToken, JWT_SECRET, (err, user) => {
    if (err) {
      // Token invalid or expired
      return res.status(401).json({ message: 'Access token expired or invalid' });
    }

    // Token is valid
    return res.status(200).json({ message: 'Access token is valid', userId: user.id });
  });
});

module.exports = router;

// Usage in app.js or server.js
// const accessTokenRoute = require('./routes/accessTokenRoute');
// app.use('/auth', accessTokenRoute);