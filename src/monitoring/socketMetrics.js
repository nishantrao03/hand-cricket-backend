const client = require("prom-client");

const { register } =
    require("./prometheus");

const socketConnectionsActive =
    new client.Gauge({
        name: "socket_connections_active",
        help: "Current active socket connections",
        registers: [register]
    });

const socketEventsTotal =
    new client.Counter({
        name: "socket_events_total",
        help: "Total socket events received",
        labelNames: [
            "event_name"
        ],
        registers: [register]
    });

const socketEventErrorsTotal =
    new client.Counter({
        name: "socket_event_errors_total",
        help: "Total socket event errors",
        labelNames: [
            "event_name"
        ],
        registers: [register]
    });

const socketEventDuration =
    new client.Histogram({
        name: "socket_event_duration_ms",
        help: "Socket event execution time in milliseconds",
        labelNames: [
            "event_name"
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

const socketRejoinsTotal =
    new client.Counter({
        name: "socket_rejoins_total",
        help: "Total successful socket rejoins",
        registers: [register]
    });

module.exports = {

    socketConnectionsActive,

    socketEventsTotal,

    socketEventErrorsTotal,

    socketEventDuration,

    socketRejoinsTotal
};