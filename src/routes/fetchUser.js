const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const fetchUserTool = require('../db/tools/fetchUser');

const { getUser } = require("../cache/get_methods/getUser");
const { setUser } = require("../cache/set_methods/setUser");

// GET /api/fetch-user
router.get(
    '/api/fetch-user',
    authenticate,
    async (req, res) => {
        try {
            // Check if a specific userId is requested (for viewing friends)
            // Otherwise, default to the logged-in user
            const id = req.query.userId || req.user.id;

            let result;

            try {
                result = await getUser(id);

                if (result) {
                    console.log(`Cache HIT: user:${id}`);

                    return res.json(result);
                }

                console.log(`Cache MISS: user:${id}`);
            }
            catch (cacheErr) {
                console.error("Redis GET Error:", cacheErr);
            }

            result = await fetchUserTool({ id });

            try {
                if (result.success) {
                    await setUser(id, result);

                    console.log(`Cache SET: user:${id}`);
                }
            }
            catch (cacheErr) {
                console.error("Redis SET Error:", cacheErr);
            }

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