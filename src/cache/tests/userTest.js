const redisClient = require("../client/redis");

const { setUser } = require("../set_methods/setUser");
const { getUser } = require("../get_methods/getUser");
const { deleteUser } = require("../delete_methods/deleteUser");

async function userTest() {
    try {
        await redisClient.connect();

        const userId = "123";

        const dummyUser = {
            id: userId,
            username: "ViratKohli18",
            country: "India",
            wins: 42,
            matches: 58,
            netRunRate: 1.84
        };

        console.log("Setting user...");
        await setUser(userId, dummyUser);

        console.log("Fetching user...");
        let user = await getUser(userId);
        console.log(user);

        console.log("Deleting user...");
        await deleteUser(userId);

        console.log("Fetching user after delete...");
        user = await getUser(userId);
        console.log(user);

        await redisClient.quit();

    } catch (err) {
        console.error(err);
    }
}

userTest();