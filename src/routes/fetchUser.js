const express = require('express');
const router = express.Router();

const authenticate =
    require('../authenticate');

const fetchUserTool =
    require('../db/tools/fetchUser');

// GET /api/fetch-user
router.get(
    '/api/fetch-user',
    authenticate,
    async (req, res) => {

        try {

            const id =
                req.user.id;

            const result =
                await fetchUserTool({
                    id
                });

            return res.json(
                result
            );

        } catch (err) {

            console.error(
                'fetch-user route error:',
                err
            );

            return res
                .status(500)
                .json({

                    success: false,

                    data: null,

                    error:
                        err.message ||
                        String(err)
                });
        }
    }
);

module.exports =
    router;