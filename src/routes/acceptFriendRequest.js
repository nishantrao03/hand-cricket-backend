const express = require('express');
const router = express.Router();

const acceptFriendRequestTool = require('../db/tools/acceptFriendRequest');
const authenticate = require('../auth_utils/authenticate');

const { deleteFriends } = require("../cache/delete_methods/deleteFriends");
const { deleteFriendRequests } = require("../cache/delete_methods/deleteFriendRequests");

router.post('/api/accept-friend-request', authenticate, async (req, res) => {
    try {
        // The receiver is the authenticated user accepting the request
        const receiverId = req.user.id;
        const { senderId } = req.body || {};

        if (!senderId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: 'senderId is required'
            });
        }

        const result = await acceptFriendRequestTool({
            senderId,
            receiverId
        });

        if (!result.success) {
            return res.status(400).json(result);
        }
        console.log(result);

        try {

            await Promise.all([
                deleteFriends(senderId),
                deleteFriends(receiverId),
                deleteFriendRequests(receiverId)
            ]);

            console.log(
                `Cache Invalidated: friends:${senderId}, friends:${receiverId}, friendRequests:${receiverId}`
            );

        } catch (cacheErr) {

            console.error(
                "Redis Delete Error:",
                cacheErr
            );
        }

        return res.status(200).json(result);

    } catch (err) {
        console.error('accept-friend-request route error:', err);

        return res.status(500).json({
            success: false,
            data: null,
            error: err.message || String(err)
        });
    }
});

module.exports = router;