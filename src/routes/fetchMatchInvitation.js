const express = require('express');
const router = express.Router();

const fetchMatchInvitationTool =
    require('../db/tools/fetchMatchInvitation');
const authenticate = require('../auth_utils/authenticate');

const { getMatchInvitation } =
    require("../cache/get_methods/getMatchInvitation");

const { setMatchInvitation } =
    require("../cache/set_methods/setMatchInvitation");

router.post(
    '/api/fetch-match-invitation',
    authenticate,
    async (req, res) => {

        try {

            const payload =
                req.body || {};

            const matchInvitationId =
                payload.id;

            if (!matchInvitationId) {

    return res.status(400).json({

        success: false,

        data: null,

        error: "matchInvitationId is required."
    });
}

            let result;

            try {

                result =
                    await getMatchInvitation(
                        matchInvitationId
                    );

                if (result) {

                    console.log(
                        `Cache HIT: matchInvitation:${matchInvitationId}`
                    );

                    return res.json(result);
                }

                console.log(
                    `Cache MISS: matchInvitation:${matchInvitationId}`
                );

            } catch (cacheErr) {

                console.error(
                    "Redis GET Error:",
                    cacheErr
                );
            }

            result =
                await fetchMatchInvitationTool(
                    payload
                );

            try {

                if (result.success) {

                    await setMatchInvitation(
                        matchInvitationId,
                        result
                    );

                    console.log(
                        `Cache SET: matchInvitation:${matchInvitationId}`
                    );
                }

            } catch (cacheErr) {

                console.error(
                    "Redis SET Error:",
                    cacheErr
                );
            }

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