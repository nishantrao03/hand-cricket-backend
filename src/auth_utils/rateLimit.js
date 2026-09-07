const { getRateLimit } =
    require("../cache/get_methods/getRateLimit");

const { setRateLimit } =
    require("../cache/set_methods/setRateLimit");

/*
 * Maximum allowed requests per route in a 1-hour window.
 */
/*
 * Maximum allowed requests per route in a 1-hour window.
 */
const ROUTE_LIMITS = {

    // Authentication
    "/login": 20,
    "/logout": 100,
    "/access-token-check": 2000,
    "/refresh-token": 200,

    // Friend Requests
    "/api/send-friend-request": 100,
    "/api/accept-friend-request": 100,
    "/api/decline-friend-request": 100,
    "/api/remove-friend": 50,

    // Match Invitations
    "/api/create-match-invitation": 200,
    "/api/fetch-match-invitation": 1000,

    // User APIs
    "/api/fetch-user": 1000,
    "/api/update-user": 100,
    "/api/create-user": 20,
    "/api/upsert-user": 1000,

    // Friend APIs
    "/api/fetch-friends": 1000,
    "/api/fetch-friend-requests": 1000,

    // Match APIs
    "/api/fetch-match": 5000,
    "/api/fetch-match-history": 500

};

const rateLimit = async (req, res, next) => {

    try {

        const route = req.path;

        const limit = ROUTE_LIMITS[route];

        if (!limit) {
            return next();
        }

        const userId = req.user?.id;

        if (!userId) {

            return res.status(401).json({
                message: "User not authenticated"
            });

        }

        const currentRequestCount =
            await getRateLimit({
                userId,
                route
            });

        if (currentRequestCount) {

            const updatedRequestCount =
                Number(currentRequestCount) + 1;

            if (updatedRequestCount > limit) {

                return res.status(429).json({
                    message: "Rate limit exceeded"
                });

            }

            await setRateLimit({

                userId,

                route,

                requestCount: updatedRequestCount,

                ttlReset: 0

            });

        } else {

            await setRateLimit({

                userId,

                route,

                requestCount: 1,

                ttlReset: 1

            });

        }

        next();

    } catch (err) {

        console.error(
            "Rate limit middleware error:",
            err
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

module.exports = rateLimit;