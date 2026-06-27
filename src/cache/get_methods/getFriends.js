const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function getFriends(userId) {
    return await cacheService.get(
        cacheKeys.friends(userId)
    );
}

module.exports = {
    getFriends
};