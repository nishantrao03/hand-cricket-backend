const cacheService =
    require("../services/cacheService");

const cacheKeys =
    require("../keys/cacheKeys");

async function getRateLimit({

    userId,

    route

}) {

    return await cacheService.get(

        cacheKeys.rateLimit(

            userId,

            route

        )

    );

}

module.exports = {

    getRateLimit

};