const express = require('express');
const router = express.Router();

const fetchMatchInvitationTool =
    require('../db/tools/fetchMatchInvitation');
const authenticate = require('../authenticate');

router.post(
    '/api/fetch-match-invitation',
    authenticate,
    async (req, res) => {

        try {

            const payload =
                req.body || {};

            console.log(payload);

            const result =
                await fetchMatchInvitationTool(
                    payload
                );

            console.log(result);

            return res.json(
                result
            );

        } catch (err) {

            console.error(
                'fetch-match-invitation route error:',
                err
            );

            return res.status(500).json({

                success: false,

                data: null,

                error:
                    err.message ||
                    String(err)
            });
        }
    }
);

module.exports = router;