const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const fetchFriendRequestsTool = require('../db/tools/fetchFriendRequests');

/*
 * GET /api/fetch-friend-requests
 * Retrieves the authenticated user's friend requests.
 */
router.get(
    '/api/fetch-friend-requests',
    authenticate,
    async (req, res) => {
        try {
            // Extract the user ID provided by the authenticate middleware
            const userId = req.user.id;
            console.log(userId);

            // Execute the database tool with the required input structure
            const result = await fetchFriendRequestsTool({
                userId
            });

            // Return the structured response from the database tool
            return res.json(result);

        } catch (err) {
            console.error('fetch-friend-requests route error:', err);

            // Fallback error formatting matching the standard API response structure
            return res.status(500).json({
                success: false,
                data: null,
                error: err.message || String(err)
            });
        }
    }
);

module.exports = router;