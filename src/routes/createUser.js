const express = require('express');
const router = express.Router();

const createUserTool = require('../db/tools/createUser');

router.post('/api/create-user', async (req, res) => {
  try {
    const payload = req.body || {};
    console.log(payload);
    const result = await createUserTool(payload);
    console.log(result);
    return res.json(result);
  } catch (err) {
    console.error('create-user route error:', err);
    return res.status(500).json({ success: false, data: null, error: err.message || String(err) });
  }
});

module.exports = router;
