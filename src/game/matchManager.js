const { activeMatches } = require("./gameState");

class MatchManager {

    createMatch({
        matchId,
        player1Id,
        overs,
        wickets
    }) {

        const match = {

            matchId,

            player1Id,
            player2Id: null,

            overs,
            wickets,

            status: "WAITING",

            ballNumber: 0,

            tossWinnerId: null,

            battingFirstPlayerId: null,

            innings: 1,

            target: null,

            winnerId: null,
            completedAt: null,

            innings1: {
                runs: 0,
                wickets: 0,
                balls: 0
            },

            innings2: {
                runs: 0,
                wickets: 0,
                balls: 0
            },

            pendingMoves: {
                batter: null,
                bowler: null
            },

            currentMoves: {
                batter: null,
                bowler: null
            },

            batterHistory: [],
            bowlerHistory: [],

            penalties: {
                batter: 0,
                bowler: 0
            },

            resultHistory: []
        };

        activeMatches.set(matchId, match);

        return match;
    }

    getMatch(matchId) {
        return activeMatches.get(matchId);
    }

    joinMatch(matchId, player2Id) {

        const match =
            activeMatches.get(matchId);

        if (!match) {
            throw new Error(
                "Match not found"
            );
        }

        match.player2Id = player2Id;

        match.status =
            "READY";

        return match;
    }

    deleteMatch(matchId) {
        activeMatches.delete(matchId);
    }
}

module.exports =
    new MatchManager();