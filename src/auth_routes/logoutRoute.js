// routes/logoutRoute.js
const express = require('express');

const router = express.Router();

router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;