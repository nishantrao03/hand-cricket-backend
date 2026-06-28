const cacheService = require("../services/cacheService");
const { matchStateKey } = require("../keys/cacheKeys");

async function getMatchState(matchId) {
    return await cacheService.get(
        matchStateKey(matchId)
    );
}

module.exports = {
    getMatchState
};