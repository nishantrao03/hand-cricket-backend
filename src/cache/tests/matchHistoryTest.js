require("dotenv").config();

const redisClient = require("../client/redis");

const {
    setMatchHistory
} = require("../set_methods/setMatchHistory");

const {
    getMatchHistory
} = require("../get_methods/getMatchHistory");

const {
    deleteMatchHistory
} = require("../delete_methods/deleteMatchHistory");

async function matchHistoryTest() {
    try {

        await redisClient.connect();

        const params = {
            userId: "123",
            limit: 5,
            sortOrder: "desc",
            cursor: null,
            outcome: "all"
        };

        const dummyHistory = {
            matches: [
                {
                    id: "match1",
                    player1: {
                        username: "Virat18"
                    },
                    player2: {
                        username: "ABD17"
                    },
                    winner: {
                        username: "Virat18"
                    }
                },
                {
                    id: "match2",
                    player1: {
                        username: "Virat18"
                    },
                    player2: {
                        username: "Rohit45"
                    },
                    winner: {
                        username: "Rohit45"
                    }
                }
            ],
            nextCursor: "match2"
        };

        console.log("Setting match history...");

        await setMatchHistory({
            ...params,
            matchHistory: dummyHistory
        });

        console.log("Fetching match history...");

        let history =
            await getMatchHistory(params);

        console.log(history);

        console.log("Deleting match history...");

        await deleteMatchHistory(params);

        console.log("Fetching match history after delete...");

        history =
            await getMatchHistory(params);

        console.log(history);

        await redisClient.quit();

    } catch (err) {

        console.error(err);
    }
}

matchHistoryTest();