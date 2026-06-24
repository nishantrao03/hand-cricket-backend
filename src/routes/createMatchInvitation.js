const express = require('express');
const router = express.Router();

const createMatchInvitationTool =
    require('../db/tools/createMatchInvitation');
const authenticate = require('../auth_utils/authenticate');

router.post(
    '/api/create-match-invitation',
    authenticate,
    async (req, res) => {

        try {

            const {
                id,
                overs,
                wickets
            } = req.body || {};

            if (!id) {

                return res.status(400).json({

                    success: false,
                    data: null,
                    error: 'id is required'
                });
            }

            const result =
                await createMatchInvitationTool({

                    id,
                    overs,
                    wickets
                });

            return res.json(
                result
            );

        } catch (err) {

            console.error(
                'create-match-invitation route error:',
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