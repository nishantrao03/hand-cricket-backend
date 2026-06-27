const cacheService = require("../services/cacheService");
const cacheKeys = require("../keys/cacheKeys");

async function deleteUser(userId) {
    await cacheService.del(
        cacheKeys.user(userId)
    );
}

module.exports = {
    deleteUser
};