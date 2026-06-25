const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const fetchUserTool = require('../db/tools/fetchUser');

// GET /api/fetch-user
router.get(
    '/api/fetch-user',
    authenticate,
    async (req, res) => {
        try {
            // Check if a specific userId is requested (for viewing friends)
            // Otherwise, default to the logged-in user
            const id = req.query.userId || req.user.id;

            const result = await fetchUserTool({
                id
            });

            return res.json(result);

        } catch (err) {
            console.error('fetch-user route error:', err);

            return res.status(500).json({
                success: false,
                data: null,
                error: err.message || String(err)
            });
        }
    }
);

module.exports = router;