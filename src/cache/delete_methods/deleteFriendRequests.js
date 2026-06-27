const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function deleteFriendRequests(userId) {
    await cacheService.del(
        cacheKeys.friendRequests(userId)
    );
}

module.exports = {
    deleteFriendRequests
};