const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const updateUserTool = require('../db/tools/updateUser');
const { setUser } = require("../cache/set_methods/setUser");

/*
 * PUT /api/update-user
 * Updates the authenticated user's profile information.
 */
router.put('/api/update-user', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const inputData = {
            ...req.body,
            id: userId
        };

        const result = await updateUserTool(inputData);

        try {
            if (result.success) {
                await setUser(userId, result);
                console.log(`Cache SET: user:${userId}`);
            }
        } catch (cacheErr) {
            console.error("Redis SET Error:", cacheErr);
        }

        return res.json(result);

    } catch (err) {
        console.error('update-user route error:', err);

        return res.status(500).json({
            success: false,
            data: null,
            error: err.message || String(err)
        });
    }
});

module.exports = router;