require("dotenv").config();

const redisClient = require("../client/redis");

const {
    setFriends
} = require("../set_methods/setFriends");

const {
    getFriends
} = require("../get_methods/getFriends");

const {
    deleteFriends
} = require("../delete_methods/deleteFriends");

async function friendsTest() {
    try {
        await redisClient.connect();

        const userId = "123";

        const dummyFriends = {
            success: true,
            data: [
                {
                    id: "1",
                    username: "Virat18",
                    wins: 50,
                    matches: 70
                },
                {
                    id: "2",
                    username: "ABD17",
                    wins: 45,
                    matches: 68
                }
            ],
            error: null
        };

        console.log("Setting friends...");
        await setFriends(
            userId,
            dummyFriends
        );

        console.log("Fetching friends...");
        let friends =
            await getFriends(userId);

        console.log(friends);

        console.log("Deleting friends...");
        await deleteFriends(userId);

        console.log("Fetching friends after delete...");
        friends =
            await getFriends(userId);

        console.log(friends);

        await redisClient.quit();
    }
    catch (err) {
        console.error(err);
    }
}

friendsTest();