const express = require('express');
const router = express.Router();

const removeFriendTool = require('../db/tools/removeFriend');
const authenticate = require('../auth_utils/authenticate');

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