const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

const USER_CACHE_TTL = 60 * 60;

async function setUser(userId, user) {
    await cacheService.set(
        cacheKeys.user(userId),
        user,
        USER_CACHE_TTL
    );
}

module.exports = {
    setUser
};