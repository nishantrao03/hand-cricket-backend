import { createClient } from "redis";

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});

redisClient.on("connect", () => {
    console.log("Redis: Connecting...");
});

redisClient.on("ready", () => {
    console.log("Redis: Connected");
});

redisClient.on("reconnecting", () => {
    console.log("Redis: Reconnecting...");
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

redisClient.on("end", () => {
    console.log("Redis: Connection Closed");
});

export default redisClient;