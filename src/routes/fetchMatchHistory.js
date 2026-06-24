// const express = require("express");
// const router = express.Router();

// // 1. Import your authentication middleware to protect the route
// const authenticate = require("../auth_utils/authenticate");

// // 2. Import the NEW standalone paginated database tool
// const fetchPaginatedMatchHistory = require("../db/tools/fetchPaginatedMatchHistory");

// router.get("/api/match-history", authenticate, async (req, res) => {
//     try {
//         // Grab the secure user ID provided by your auth middleware
//         const userId = req.user.id;

//         // Parse the dynamic pagination parameters from the URL query string
//         // Example URL: /api/match-history?limit=20&sortOrder=desc&cursor=match_123
//         const limit = parseInt(req.query.limit) || 5;
//         const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
//         const cursor = req.query.cursor || null;

//         // Pass the sanitized parameters directly to the DB tool
//         const result = await fetchPaginatedMatchHistory({
//             userId,
//             limit,
//             sortOrder,
//             cursor
//         });
//         console.log(result);

//         // Send the { matches, nextCursor } object back to TanStack Query
//         res.json(result);

//     } catch (error) {
//         console.error("API Route Error - /api/match-history:", error);
//         res.status(500).json({ error: "Internal server error fetching match history" });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const authenticate = require("../auth_utils/authenticate");
const fetchPaginatedMatchHistory = require("../db/tools/fetchPaginatedMatchHistory");

router.get("/api/match-history", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const limit = parseInt(req.query.limit) || 5;
        const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
        const cursor = req.query.cursor || null;
        const outcome = req.query.outcome || "all";

        const result = await fetchPaginatedMatchHistory({
            userId,
            limit,
            sortOrder,
            cursor,
            outcome
        });

        res.json(result);

    } catch (error) {
        console.error("API Route Error - /api/match-history:", error);
        res.status(500).json({ error: "Internal server error fetching match history" });
    }
});

module.exports = router;