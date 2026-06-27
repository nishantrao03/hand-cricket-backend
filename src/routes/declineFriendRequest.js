const express = require('express');
const router = express.Router();

const declineFriendRequestTool = require('../db/tools/declineFriendRequest');
const authenticate = require('../auth_utils/authenticate');
const { deleteFriendRequests } = require("../cache/delete_methods/deleteFriendRequests");

router.post('/api/decline-friend-request', authenticate, async (req, res) => {
    try {
        const receiverId = req.user.id;
        const { senderId } = req.body || {};

        if (!senderId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: 'senderId is required'
            });
        }

        const result = await declineFriendRequestTool({ senderId, receiverId });

        if (!result.success) {
            return res.status(400).json(result);
        }

        try {
            await deleteFriendRequests(receiverId);
            console.log(`Cache Invalidated: friendRequests:${receiverId}`);
        } catch (cacheErr) {
            console.error("Redis Delete Error:", cacheErr);
        }

        return res.status(200).json(result);

    } catch (err) {
        console.error('decline-friend-request route error:', err);
        return res.status(500).json({
            success: false,
            data: null,
            error: err.message || String(err)
        });
    }
});

module.exports = router;