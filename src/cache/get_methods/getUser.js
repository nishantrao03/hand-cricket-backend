const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function getUser(userId) {
    return await cacheService.get(
        cacheKeys.user(userId)
    );
}

module.exports = {
    getUser
};