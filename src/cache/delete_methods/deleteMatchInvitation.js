const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function deleteMatchInvitation(matchInvitationId) {
    await cacheService.del(
        cacheKeys.matchInvitation(matchInvitationId)
    );
}

module.exports = {
    deleteMatchInvitation
};