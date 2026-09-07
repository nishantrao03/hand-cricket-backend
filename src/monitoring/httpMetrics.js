const client = require("prom-client");

const { register } =
    require("./prometheus");

const httpRequestDuration =
    new client.Histogram({

        name: "http_request_duration_ms",

        help: "HTTP request duration in milliseconds",

        labelNames: [
            "method",
            "route",
            "status_code"
        ],

        buckets: [
            10,
            25,
            50,
            100,
            250,
            500,
            1000,
            2500,
            5000
        ],

        registers: [register]

    });

const httpRequestsTotal =
    new client.Counter({

        name: "http_requests_total",

        help: "Total number of HTTP requests",

        labelNames: [
            "method",
            "route",
            "status_code"
        ],

        registers: [register]

    });

module.exports = {

    httpRequestDuration,

    httpRequestsTotal

};