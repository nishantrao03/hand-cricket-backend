const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

const FRIEND_REQUESTS_CACHE_TTL = 60 * 10;

async function setFriendRequests(userId, friendRequests) {
    await cacheService.set(
        cacheKeys.friendRequests(userId),
        friendRequests,
        FRIEND_REQUESTS_CACHE_TTL
    );
}

module.exports = {
    setFriendRequests
};