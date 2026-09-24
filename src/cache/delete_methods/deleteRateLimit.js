const cacheService =
    require("../services/cacheService");

const cacheKeys =
    require("../keys/cacheKeys");

async function deleteRateLimit({

    userId,

    route

}) {

    await cacheService.del(

        cacheKeys.rateLimit(

            userId,

            route

        )

    );

}

module.exports = {

    deleteRateLimit

};