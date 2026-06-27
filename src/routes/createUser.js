const express = require('express');
const router = express.Router();

const createUserTool = require('../db/tools/createUser');
const authenticate = require('../auth_utils/authenticate');
const { setUser } = require("../cache/set_methods/setUser");

router.post('/api/create-user', authenticate, async (req, res) => {
    try {
        const payload = req.body || {};
        const result = await createUserTool(payload);

        try {
            if (result.success) {
                await setUser(result.data.id, result);
                console.log(`Cache SET: user:${result.data.id}`);
            }
        } catch (cacheErr) {
            console.error("Redis SET Error:", cacheErr);
        }

        return res.json(result);

    } catch (err) {
        console.error('create-user route error:', err);
        return res.status(500).json({ success: false, data: null, error: err.message || String(err) });
    }
});

module.exports = router;