const cacheService = require("../services/cacheService");
const { matchStateKey } = require("../keys/cacheKeys");

async function deleteMatchState(matchId) {
    await cacheService.del(
        matchStateKey(matchId)
    );
}

module.exports = {
    deleteMatchState
};