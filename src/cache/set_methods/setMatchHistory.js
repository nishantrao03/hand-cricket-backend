const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

const MATCH_HISTORY_CACHE_TTL = 60 * 30;

async function setMatchHistory({
    userId,
    limit,
    sortOrder,
    cursor,
    outcome,
    matchHistory
}) {
    await cacheService.set(
        cacheKeys.matchHistory(
            userId,
            limit,
            sortOrder,
            cursor,
            outcome
        ),
        matchHistory,
        MATCH_HISTORY_CACHE_TTL
    );
}

module.exports = {
    setMatchHistory
};