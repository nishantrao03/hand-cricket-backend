const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function getMatchHistory({
    userId,
    limit,
    sortOrder,
    cursor,
    outcome
}) {
    return await cacheService.get(
        cacheKeys.matchHistory(
            userId,
            limit,
            sortOrder,
            cursor,
            outcome
        )
    );
}

module.exports = {
    getMatchHistory
};