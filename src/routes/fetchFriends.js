const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const fetchFriendsTool = require('../db/tools/fetchFriends');

/*
 * GET /api/fetch-friends
 * Retrieves the authenticated user's friend list.
 */
router.get(
    '/api/fetch-friends',
    authenticate,
    async (req, res) => {
        try {
            // Extract the user ID provided by the authenticate middleware
            const userId = req.user.id;

            // Execute the database tool with the required input structure
            const result = await fetchFriendsTool({
                userId
            });

            // Return the structured response from the database tool
            return res.json(result);

        } catch (err) {
            console.error('fetch-friends route error:', err);

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