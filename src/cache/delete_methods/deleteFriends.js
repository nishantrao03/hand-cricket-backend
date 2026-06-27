const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function deleteFriends(userId) {
    await cacheService.del(
        cacheKeys.friends(userId)
    );
}

module.exports = {
    deleteFriends
};