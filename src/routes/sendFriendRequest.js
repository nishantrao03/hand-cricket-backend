const express = require('express');
const router = express.Router();

const sendFriendRequestTool = require('../db/tools/sendFriendRequest');

router.post('/api/send-request', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body || {};
    const result = await sendFriendRequestTool({ senderId, receiverId });
    return res.json(result);
  } catch (err) {
    console.error('send-request route error:', err);
    return res.status(500).json({ success: false, data: null, error: err.message || String(err) });
  }
});

module.exports = router;
