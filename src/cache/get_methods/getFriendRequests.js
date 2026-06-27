const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function getFriendRequests(userId) {
    return await cacheService.get(
        cacheKeys.friendRequests(userId)
    );
}

module.exports = {
    getFriendRequests
};