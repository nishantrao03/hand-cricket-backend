require("dotenv").config();

const redisClient = require("../client/redis");

const {
    setMatchInvitation
} = require("../set_methods/setMatchInvitation");

const {
    getMatchInvitation
} = require("../get_methods/getMatchInvitation");

const {
    deleteMatchInvitation
} = require("../delete_methods/deleteMatchInvitation");

async function matchInvitationTest() {
    try {
        await redisClient.connect();

        const matchInvitationId = "invite_123";

        const dummyInvitation = {
            success: true,
            data: {
                id: matchInvitationId,
                senderId: "101",
                receiverId: "102",
                format: "5 Overs",
                status: "PENDING"
            },
            error: null
        };

        console.log("Setting match invitation...");
        await setMatchInvitation(
            matchInvitationId,
            dummyInvitation
        );

        console.log("Fetching match invitation...");
        let invitation =
            await getMatchInvitation(matchInvitationId);

        console.log(invitation);

        console.log("Deleting match invitation...");
        await deleteMatchInvitation(matchInvitationId);

        console.log("Fetching match invitation after delete...");
        invitation =
            await getMatchInvitation(matchInvitationId);

        console.log(invitation);

        await redisClient.quit();

    }
    catch (err) {
        console.error(err);
    }
}

matchInvitationTest();