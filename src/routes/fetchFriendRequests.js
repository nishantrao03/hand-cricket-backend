const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const fetchFriendRequestsTool = require('../db/tools/fetchFriendRequests');

const { getFriendRequests } = require("../cache/get_methods/getFriendRequests");
const { setFriendRequests } = require("../cache/set_methods/setFriendRequests");

/*
 * GET /api/fetch-friend-requests
 * Retrieves the authenticated user's friend requests.
 */
router.get(
    '/api/fetch-friend-requests',
    authenticate,
    async (req, res) => {
        try {
            const userId = req.user.id;

            let result;

            try {
                result = await getFriendRequests(userId);

                if (result) {
                    console.log(`Cache HIT: friendRequests:${userId}`);

                    return res.json(result);
                }

                console.log(`Cache MISS: friendRequests:${userId}`);
            }
            catch (cacheErr) {
                console.error("Redis GET Error:", cacheErr);
            }

            result = await fetchFriendRequestsTool({
                userId
            });

            try {
                if (result.success) {
                    await setFriendRequests(
                        userId,
                        result
                    );

                    console.log(`Cache SET: friendRequests:${userId}`);
                }
            }
            catch (cacheErr) {
                console.error("Redis SET Error:", cacheErr);
            }

            return res.json(result);

        } catch (err) {
            console.error('fetch-friend-requests route error:', err);

            return res.status(500).json({
                success: false,
                data: null,
                error: err.message || String(err)
            });
        }
    }
);

module.exports = router;