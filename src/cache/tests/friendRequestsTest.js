require("dotenv").config();

const redisClient = require("../client/redis");

const {
    setFriendRequests
} = require("../set_methods/setFriendRequests");

const {
    getFriendRequests
} = require("../get_methods/getFriendRequests");

const {
    deleteFriendRequests
} = require("../delete_methods/deleteFriendRequests");

async function friendRequestsTest() {
    try {
        await redisClient.connect();

        const userId = "123";

        const dummyFriendRequests = {
            success: true,
            data: [
                {
                    id: "fr1",
                    senderId: "101",
                    senderUsername: "Virat18",
                    status: "PENDING"
                },
                {
                    id: "fr2",
                    senderId: "102",
                    senderUsername: "ABD17",
                    status: "PENDING"
                }
            ],
            error: null
        };

        console.log("Setting friend requests...");
        await setFriendRequests(
            userId,
            dummyFriendRequests
        );

        console.log("Fetching friend requests...");
        let friendRequests =
            await getFriendRequests(userId);

        console.log(friendRequests);

        console.log("Deleting friend requests...");
        await deleteFriendRequests(userId);

        console.log("Fetching friend requests after delete...");
        friendRequests =
            await getFriendRequests(userId);

        console.log(friendRequests);

        await redisClient.quit();
    }
    catch (err) {
        console.error(err);
    }
}

friendRequestsTest();