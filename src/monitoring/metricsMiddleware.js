const {

    httpRequestDuration,

    httpRequestsTotal

} = require("./httpMetrics");

const metricsMiddleware = (

    req,

    res,

    next

) => {

    const startTime = Date.now();

    res.on("finish", () => {

        const duration =
            Date.now() - startTime;

        const route =
            req.route?.path ||
            req.path;

        const method =
            req.method;

        const statusCode =
            res.statusCode;

        httpRequestsTotal
            .labels(
                method,
                route,
                String(statusCode)
            )
            .inc();

        httpRequestDuration
            .labels(
                method,
                route,
                String(statusCode)
            )
            .observe(duration);

    });

    next();

};

module.exports =
    metricsMiddleware;