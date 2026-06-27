const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function deleteMatchHistory({
    userId,
    limit,
    sortOrder,
    cursor,
    outcome
}) {
    await cacheService.del(
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
    deleteMatchHistory
};