const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

const FRIENDS_CACHE_TTL = 60 * 30;

async function setFriends(userId, friends) {
    await cacheService.set(
        cacheKeys.friends(userId),
        friends,
        FRIENDS_CACHE_TTL
    );
}

module.exports = {
    setFriends
};