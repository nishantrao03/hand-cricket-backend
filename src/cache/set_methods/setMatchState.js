const cacheService = require("../services/cacheService");
const { matchStateKey } = require("../keys/cacheKeys");

async function setMatchState(
    matchId,
    matchState
) {
    await cacheService.set(
        matchStateKey(matchId),
        matchState
    );
}

module.exports = {
    setMatchState
};