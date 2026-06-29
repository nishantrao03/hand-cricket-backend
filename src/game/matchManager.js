const { activeMatches } = require("./gameState");
const { getUser } = require("../cache/get_methods/getUser"); 
const fetchUser = require("../db/tools/fetchUser"); 

class MatchManager {

    async createMatch({
        matchId,
        player1Id,
        player1UserName,
        overs,
        wickets
    }) {

        let resolvedUserName = player1UserName;
        if (!resolvedUserName) {
            resolvedUserName = await this.fetchUsername(player1Id);
        }

        const match = {

            matchId,

            player1Id,
            player2Id: null,

            player1UserName: resolvedUserName,
            player2UserName: null,

            overs,
            wickets,

            status: "WAITING",

            ballNumber: 0,

            tossWinnerId: null,

            battingFirstPlayerId: null,

            player1Ready: false,

            player2Ready: false,

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

            resultHistory: [],

            phase: "WAITING"
        };

        activeMatches.set(matchId, match);

        return match;
    }

    getMatch(matchId) {
        return activeMatches.get(matchId);
    }

    setMatch(match) {
        activeMatches.set(match.matchId, match);
        return match;
    }

    async joinMatch(matchId, player2Id, player2UserName) {

        const match =
            activeMatches.get(matchId);

        if (!match) {
            throw new Error(
                "Match not found"
            );
        }

        /* Resolve username if not provided in the initial call */
        let resolvedUserName = player2UserName;
        if (!resolvedUserName) {
            resolvedUserName = await this.fetchUsername(player2Id);
        }

        match.player2Id = player2Id;

        match.player2UserName = resolvedUserName;

        match.status =
            "READY";

        return match;
    }

    deleteMatch(matchId) {
        activeMatches.delete(matchId);
    }

    async fetchUsername(userId) {
        try {
            /* 1. Attempt to fetch user from cache */
            const cachedUser = await getUser(userId);
            if (cachedUser && cachedUser.username) {
                return cachedUser.username;
            }

            /* 2. Fallback to database if cache misses */
            const dbResponse = await fetchUser({ id: userId });
            if (dbResponse && dbResponse.success && dbResponse.data && dbResponse.data.username) {
                return dbResponse.data.username;
            }

            return null;
        } catch (error) {
            console.error("Error fetching username for userId:", userId, error);
            return null;
        }
    }
}

module.exports =
    new MatchManager();