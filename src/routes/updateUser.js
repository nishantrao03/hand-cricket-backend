const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const updateUserTool = require('../db/tools/updateUser');

/*
 * PUT /api/update-user
 * Updates the authenticated user's profile information.
 */
router.put(
    '/api/update-user',
    authenticate,
    async (req, res) => {
        try {
            // Extract the user ID provided by the authenticate middleware
            console.log("UPDATE INPUT");
            console.log(req);
            const userId = req.user.id;
            //console.log(userId);

            // Securely construct input by forcing the authenticated user's ID
            // and spreading the rest of the updatable fields from the request body
            const inputData = {
                ...req.body,
                id: userId 
            };

            // Execute the database tool with the required input structure
            const result = await updateUserTool(inputData);

            // Return the structured response from the database tool
            return res.json(result);

        } catch (err) {
            console.error('update-user route error:', err);

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