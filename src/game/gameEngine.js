const MatchManager =
require("./matchManager");

const getWicketsLost =
require("./wicketCalculator");

const hasPenalty =
require("./penaltyChecker");

class GameEngine {

    performToss(matchId) {

        const match =
            MatchManager.getMatch(matchId);

        if (!match) {
            throw new Error(
                "Match not found"
            );
        }

        if (!match.player2Id) {
            throw new Error(
                "Waiting for second player"
            );
        }

        const tossWinnerId =
            Math.random() < 0.5
                ? match.player1Id
                : match.player2Id;

        match.tossWinnerId =
            tossWinnerId;

        return {
            tossWinnerId
        };
    }

    chooseBatOrBowl(
    matchId,
    playerId,
    choice
) {

    const match =
        MatchManager.getMatch(matchId);

    if (!match) {
        throw new Error(
            "Match not found"
        );
    }

    if (
        match.tossWinnerId !== playerId
    ) {
        throw new Error(
            "Only toss winner can choose"
        );
    }

    const opponentId =
        playerId === match.player1Id
            ? match.player2Id
            : match.player1Id;

    if (choice === "BAT") {

        match.battingFirstPlayerId =
            playerId;

    } else if (
        choice === "BOWL"
    ) {

        match.battingFirstPlayerId =
            opponentId;

    } else {

        throw new Error(
            "Choice must be BAT or BOWL"
        );

    }

    return {

        battingFirstPlayerId:
            match.battingFirstPlayerId

    };
}

    resolveBall(
    match,
    batterNumber,
    bowlerNumber
) {

    const inningsState =
        match.innings === 1
            ? match.innings1
            : match.innings2;

    const batterId =

    match.innings === 1

        ? match.battingFirstPlayerId

        : (
            match.battingFirstPlayerId ===
            match.player1Id

                ? match.player2Id

                : match.player1Id
        );

    let runs = 0;
    let wicketsLost = 0;

    let penaltyApplied = null;

    match.batterHistory.push(
        batterNumber
    );

    match.bowlerHistory.push(
        bowlerNumber
    );

    if (
        batterNumber === 0
    ) {

        runs = 0;
        wicketsLost = 0;

    } else if (
        batterNumber ===
        bowlerNumber
    ) {

        wicketsLost =
            getWicketsLost(
                batterNumber
            );

        inningsState.wickets =
            Math.min(
                inningsState.wickets +
                wicketsLost,

                match.wickets
            );

    } else {

        const difference =
            Math.abs(
                batterNumber -
                bowlerNumber
            );

        runs =
            difference === 5
                ? 6
                : difference;

        inningsState.runs +=
            runs;
    }

    if (
        hasPenalty(
            match.batterHistory
        )
    ) {

        inningsState.runs =
            Math.max(
                0,
                inningsState.runs - 10
            );

        match.penalties.batter++;

        penaltyApplied =
            "BATTER";
    }

    if (
        hasPenalty(
            match.bowlerHistory
        )
    ) {

        inningsState.runs += 10;

        match.penalties.bowler++;

        penaltyApplied =
            "BOWLER";
    }

    inningsState.balls++;

    match.ballNumber++;

    match.resultHistory.push({

        innings:
            match.innings,

        ballNumber:
            match.ballNumber,

        batterNumber,

        bowlerNumber,

        runs,

        wicketsLost,

        penaltyApplied
    });

    if (
        this.checkInningsEnd(
            match
        )
    ) {

        if (
            match.innings === 1
        ) {

            return {
                ballResult: {

                    batterId,

                    runs,

                    wicketsLost,

                    score:
                        inningsState.runs,

                    wickets:
                        inningsState.wickets,

                    balls:
                        inningsState.balls,

                    penaltyApplied
                },

                inningsResult:
                    this.switchInnings(
                        match
                    )
            };
        }

        return {
            ballResult: {

                batterId,

                runs,

                wicketsLost,

                score:
                    inningsState.runs,

                wickets:
                    inningsState.wickets,

                balls:
                    inningsState.balls,

                penaltyApplied
            },

            matchResult:
                this.endMatch(
                    match
                )
        };
    }

    return {

        batterId,

        runs,

        wicketsLost,

        score:
            inningsState.runs,

        wickets:
            inningsState.wickets,

        balls:
            inningsState.balls,

        penaltyApplied
    };
}

    submitMove({

    matchId,

    batterNumber,

    bowlerNumber

}) {

    const match =
        MatchManager.getMatch(
            matchId
        );

    if (!match) {

        throw new Error(
            "Match not found"
        );
    }

    if (
        this.checkMatchEnd(
            match
        )
    ) {

        return this.endMatch(
            match
        );
    }

    if (
        batterNumber < 0 ||
        batterNumber > 6
    ) {

        throw new Error(
            "Batter number must be between 0 and 6"
        );
    }

    if (
        bowlerNumber < 1 ||
        bowlerNumber > 6
    ) {

        throw new Error(
            "Bowler number must be between 1 and 6"
        );
    }

    return this.resolveBall(

        match,

        batterNumber,

        bowlerNumber
    );
}

    checkInningsEnd(match) {

    const inningsState =
        match.innings === 1
            ? match.innings1
            : match.innings2;

    const maxBalls =
        match.overs * 6;

    if (
        inningsState.wickets >=
        match.wickets
    ) {

        return true;
    }

    if (
        inningsState.balls >=
        maxBalls
    ) {

        return true;
    }

    if (

        match.innings === 2 &&

        inningsState.runs >=
        match.target

    ) {

        return true;
    }

    return false;
}

    switchInnings(match) {

    match.innings = 2;

    match.target =
        match.innings1.runs + 1;

    match.batterHistory = [];

    match.bowlerHistory = [];

    return {

        inningsEnded: true,

        innings: 2,

        target:
            match.target
    };
}

    checkMatchEnd(match) {

    if (
        match.status === "COMPLETED"
    ) {
        return true;
    }

    // Match cannot end during innings 1
    if (
        match.innings !== 2
    ) {
        return false;
    }

    const innings2 =
        match.innings2;

    const maxBalls =
        match.overs * 6;

    if (
        match.target !== null &&
        innings2.runs >= match.target
    ) {
        return true;
    }

    if (
        innings2.wickets >=
        match.wickets
    ) {
        return true;
    }

    if (
        innings2.balls >=
        maxBalls
    ) {
        return true;
    }

    return false;
}

    endMatch(match) {

    const innings1Runs =
        match.innings1.runs;

    const innings2Runs =
        match.innings2.runs;

    const secondInningsBatterId =

        match.battingFirstPlayerId ===
        match.player1Id

            ? match.player2Id

            : match.player1Id;

    let winnerId = null;

    let reason = "TIE";

    if (
        innings2Runs >=
        match.target
    ) {

        winnerId =
            secondInningsBatterId;

        reason =
            "CHASE_COMPLETED";

    } else if (
        innings2Runs >
        innings1Runs
    ) {

        winnerId =
            secondInningsBatterId;

        reason =
            "HIGHER_SCORE";

    } else if (
        innings2Runs <
        innings1Runs
    ) {

        winnerId =
            match.battingFirstPlayerId;

        reason =
            "DEFENDED_TARGET";
    }

    match.status =
        "COMPLETED";

    match.winnerId =
        winnerId;

    match.completedAt =
        new Date();

    const player1Score =

        match.battingFirstPlayerId ===
        match.player1Id

            ? innings1Runs

            : innings2Runs;

    const player2Score =

        match.battingFirstPlayerId ===
        match.player2Id

            ? innings1Runs

            : innings2Runs;

    return {

        matchEnded: true,

        winnerId,

        reason,

        player1Score,

        player2Score
    };
}
}

module.exports =
    new GameEngine();