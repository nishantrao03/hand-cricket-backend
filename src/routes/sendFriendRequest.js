const express = require('express');
const router = express.Router();

const sendFriendRequestTool = require('../db/tools/sendFriendRequest');
const authenticate = require('../auth_utils/authenticate');
const { deleteFriendRequests } = require("../cache/delete_methods/deleteFriendRequests");

router.post('/api/send-request', authenticate, async (req, res) => {
    try {
        const { senderId, receiverId } = req.body || {};

        const result = await sendFriendRequestTool({ senderId, receiverId });

        try {
            if (result.success) {
                await deleteFriendRequests(receiverId);
                console.log(`Cache Invalidated: friendRequests:${receiverId}`);
            }
        } catch (cacheErr) {
            console.error("Redis Delete Error:", cacheErr);
        }

        return res.json(result);

    } catch (err) {
        console.error('send-request route error:', err);
        return res.status(500).json({
            success: false,
            data: null,
            error: err.message || String(err)
        });
    }
});

module.exports = router;