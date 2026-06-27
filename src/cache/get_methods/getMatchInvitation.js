const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function getMatchInvitation(matchInvitationId) {
    return await cacheService.get(
        cacheKeys.matchInvitation(matchInvitationId)
    );
}

module.exports = {
    getMatchInvitation
};