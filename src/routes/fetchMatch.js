const express = require('express');
const router = express.Router();

const fetchMatchTool = require('../db/tools/fetchMatch');

// GET /api/fetch-match?id=<matchId>
router.get('/api/fetch-match', async (req, res) => {
  try {
    const id = req.query.id || (req.body && req.body.id);
    const result = await fetchMatchTool({ id });
    return res.json(result);
  } catch (err) {
    console.error('fetch-match route error:', err);
    return res.status(500).json({ success: false, data: null, error: err.message || String(err) });
  }
});

module.exports = router;
