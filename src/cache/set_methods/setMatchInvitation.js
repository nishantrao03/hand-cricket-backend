const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

const MATCH_INVITATION_CACHE_TTL = 60 * 10;

async function setMatchInvitation(matchInvitationId, matchInvitation) {
    await cacheService.set(
        cacheKeys.matchInvitation(matchInvitationId),
        matchInvitation,
        MATCH_INVITATION_CACHE_TTL
    );
}

module.exports = {
    setMatchInvitation
};