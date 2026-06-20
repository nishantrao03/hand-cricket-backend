const express = require('express');
const router = express.Router();

const fetchUserTool = require('../db/tools/fetchUser');

// GET /api/fetch-user?id=<userId>
router.get('/api/fetch-user', async (req, res) => {
  try {
    const id = req.query.id || (req.body && req.body.id);
    const result = await fetchUserTool({ id });
    return res.json(result);
  } catch (err) {
    console.error('fetch-user route error:', err);
    return res.status(500).json({ success: false, data: null, error: err.message || String(err) });
  }
});

module.exports = router;
