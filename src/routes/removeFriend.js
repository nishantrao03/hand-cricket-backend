const express = require('express');
const router = express.Router();

const removeFriendTool = require('../db/tools/removeFriend');
const authenticate = require('../auth_utils/authenticate');
const { deleteFriends } = require("../cache/delete_methods/deleteFriends");

router.post('/api/remove-friend', authenticate, async (req, res) => {
    try {
        const { userId, friendId } = req.body || {};

        if (!userId || !friendId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: 'userId and friendId are required'
            });
        }

        const result = await removeFriendTool({ userId, friendId });

        if (!result.success) {
            return res.status(400).json(result);
        }

        try {
            await Promise.all([
                deleteFriends(userId),
                deleteFriends(friendId)
            ]);

            console.log(`Cache Invalidated: friends:${userId}, friends:${friendId}`);
        } catch (cacheErr) {
            console.error("Redis Delete Error:", cacheErr);
        }

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: null,
            error: err.message || String(err)
        });
    }
});

module.exports = router;