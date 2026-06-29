const express = require('express');
const router = express.Router();

const authenticate = require('../auth_utils/authenticate');
const upsertUserTool = require('../db/tools/upsertUser');

const { getUser } = require("../cache/get_methods/getUser");
const { setUser } = require("../cache/set_methods/setUser");

// GET /api/upsert-user
router.get(
    '/api/upsert-user',
    authenticate,
    async (req, res) => {
        try {
            const id = req.user.id;

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

            result = await upsertUserTool({ id });

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
            console.error('upsert-user route error:', err);

            return res.status(500).json({
                success: false,
                data: null,
                error: err.message || String(err)
            });
        }
    }
);

module.exports = router;