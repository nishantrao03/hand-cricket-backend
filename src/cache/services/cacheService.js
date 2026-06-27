const redisClient = require("../client/redis");

async function get(key) {
    const data = await redisClient.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
}

async function set(
    key,
    value,
    ttl = 3600
) {
    await redisClient.set(
        key,
        JSON.stringify(value),
        {
            EX: ttl
        }
    );
}

async function del(key) {
    await redisClient.del(key);
}

async function delMany(keys) {
    if (!keys || keys.length === 0) {
        return;
    }

    await redisClient.del(keys);
}

async function exists(key) {
    return await redisClient.exists(key);
}

module.exports = {
    get,
    set,
    del,
    delMany,
    exists
};