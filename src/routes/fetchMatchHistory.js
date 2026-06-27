const express = require("express");
const router = express.Router();

const authenticate = require("../auth_utils/authenticate");
const fetchPaginatedMatchHistory = require("../db/tools/fetchPaginatedMatchHistory");

const { getMatchHistory } = require("../cache/get_methods/getMatchHistory");
const { setMatchHistory } = require("../cache/set_methods/setMatchHistory");

router.get("/api/match-history", authenticate, async (req, res) => {
    try {

        const userId = req.user.id;

        const limit = parseInt(req.query.limit) || 5;
        const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
        const cursor = req.query.cursor || null;
        const outcome = req.query.outcome || "all";

        const cacheParams = {
            userId,
            limit,
            sortOrder,
            cursor,
            outcome
        };

        let result;

        try {

            result = await getMatchHistory(cacheParams);

            if (result) {

                console.log(
                    `Cache HIT: matchHistory:${userId}`
                );

                return res.json(result);
            }

            console.log(
                `Cache MISS: matchHistory:${userId}`
            );

        } catch (cacheErr) {

            console.error(
                "Redis GET Error:",
                cacheErr
            );
        }

        result =
            await fetchPaginatedMatchHistory(
                cacheParams
            );

        try {

            await setMatchHistory({
                ...cacheParams,
                matchHistory: result
            });

            console.log(
                `Cache SET: matchHistory:${userId}`
            );

        } catch (cacheErr) {

            console.error(
                "Redis SET Error:",
                cacheErr
            );
        }

        return res.json(result);

    } catch (error) {

        console.error(
            "API Route Error - /api/match-history:",
            error
        );

        return res.status(500).json({
            error: "Internal server error fetching match history"
        });
    }
});

module.exports = router;