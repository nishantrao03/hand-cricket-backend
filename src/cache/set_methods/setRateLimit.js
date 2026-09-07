const cacheService =
    require("../services/cacheService");

const cacheKeys =
    require("../keys/cacheKeys");

const RATE_LIMIT_CACHE_TTL = 60 * 60;

async function setRateLimit({

    userId,

    route,

    requestCount,

    ttlReset

}) {

    if (ttlReset) {

        console.log("Setting reset rate limit for userId:", userId, "route:", route, "requestCount:", requestCount, "with TTL reset");
        await cacheService.set(

            cacheKeys.rateLimit(

                userId,

                route

            ),

            requestCount,

            RATE_LIMIT_CACHE_TTL

        );

    } else {

        await cacheService.set(

            cacheKeys.rateLimit(

                userId,

                route

            ),

            requestCount

        );

    }

}

module.exports = {

    setRateLimit

};