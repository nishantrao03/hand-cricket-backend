const removeFriend = require("../tools/removeFriend");

async function run() {
    try {
        const result = await removeFriend({
            userId: "test-user-1",
            friendId: "test-user-3"
        });

        console.log(result);

    } catch (err) {
        console.error(err);
    }
}

run();