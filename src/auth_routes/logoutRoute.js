// routes/logoutRoute.js
const express = require('express');

const router = express.Router();

const rateLimit = require('../auth_utils/rateLimit');

router.post('/logout', rateLimit, (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;