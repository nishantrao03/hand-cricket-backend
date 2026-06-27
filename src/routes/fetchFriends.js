const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const fetchFriendsTool = require('../db/tools/fetchFriends');

const { getFriends } = require("../cache/get_methods/getFriends");
const { setFriends } = require("../cache/set_methods/setFriends");

/*
 * GET /api/fetch-friends
 * Retrieves the authenticated user's friend list.
 */
router.get(
    '/api/fetch-friends',
    authenticate,
    async (req, res) => {
        try {
            const userId = req.user.id;

            let result;

            try {
                result = await getFriends(userId);

                if (result) {
                    console.log(`Cache HIT: friends:${userId}`);

                    return res.json(result);
                }

                console.log(`Cache MISS: friends:${userId}`);
            }
            catch (cacheErr) {
                console.error("Redis GET Error:", cacheErr);
            }

            result = await fetchFriendsTool({
                userId
            });

            try {
                if (result.success) {
                    await setFriends(
                        userId,
                        result
                    );

                    console.log(`Cache SET: friends:${userId}`);
                }
            }
            catch (cacheErr) {
                console.error("Redis SET Error:", cacheErr);
            }

            return res.json(result);

        } catch (err) {
            console.error('fetch-friends route error:', err);

            return res.status(500).json({
                success: false,
                data: null,
                error: err.message || String(err)
            });
        }
    }
);

module.exports = router;