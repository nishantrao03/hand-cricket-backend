require("dotenv").config();

const redisClient = require("../client/redis");

const {
    setMatchState
} = require("../set_methods/setMatchState");

const {
    getMatchState
} = require("../get_methods/getMatchState");

const {
    deleteMatchState
} = require("../delete_methods/deleteMatchState");

async function matchStateTest() {
    try {

        await redisClient.connect();

        const matchId = "match123";

        const dummyMatchState = {

            matchId,

            player1Id: "player1",

            player2Id: "player2",

            phase: "PLAYING",

            innings: 1,

            overs: 2,

            wickets: 5,

            battingFirstPlayerId: "player1",

            tossWinnerId: "player2",

            pendingMoves: {
                batter: null,
                bowler: null
            },

            innings1: {
                runs: 34,
                wickets: 2,
                balls: 21
            },

            innings2: {
                runs: 0,
                wickets: 0,
                balls: 0
            }
        };

        console.log("Setting match state...");

        await setMatchState(
            matchId,
            dummyMatchState
        );

        console.log("Fetching match state...");

        let matchState =
            await getMatchState(
                matchId
            );

        console.log(matchState);

        console.log("Deleting match state...");

        await deleteMatchState(
            matchId
        );

        console.log("Fetching match state after delete...");

        matchState =
            await getMatchState(
                matchId
            );

        console.log(matchState);

        await redisClient.quit();

    } catch (err) {

        console.error(err);
    }
}

matchStateTest();