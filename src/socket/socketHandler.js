const {
    activeRooms,
    matchTimers
} = require(
    "./socketState"
);

const GameEngine =
    require("../game/gameEngine");

const MatchManager = require("../game/matchManager");

const createMatch =
    require("../db/tools/createMatch");

const updateUser =
    require("../db/tools/updateUser");

function cleanupMatch(
    matchId
) {

    try {

        activeRooms.delete(
            matchId
        );

        matchTimers.delete(
            matchId
        );

        MatchManager.deleteMatch(
            matchId
        );

    } catch (err) {

        console.error(
            `cleanupMatch error for ${matchId}:`,
            err
        );
    }
}

function endMatch(
    io,
    matchId,
    reason
) {

    try {

        const match =
            MatchManager.getMatch(
                matchId
            );

        if (!match) {
            return;
        }

        const timer =
            matchTimers.get(
                matchId
            );

        if (timer) {

            clearTimeout(
                timer
            );

            matchTimers.delete(
                matchId
            );
        }

        if (
            reason ===
            "MATCH_COMPLETED"
        ) {

            match.status =
                "COMPLETED";

        } else {

            match.status =
                "ABANDONED";
        }

        io.to(
            matchId
        ).emit(
            "match-ended",
            {
                matchId,
                reason
            }
        );

        setTimeout(
        () => {

            try {

                const sockets =
                    io.sockets.adapter.rooms.get(
                        matchId
                    );

                if (sockets) {

                    sockets.forEach(
                        (socketId) => {

                            const socket =
                                io.sockets.sockets.get(
                                    socketId
                                );

                            if (socket) {

                                socket.disconnect(
                                    true
                                );
                            }
                        }
                    );
                }

                cleanupMatch(
                    matchId
                );

            } catch (innerErr) {

                console.error(
                    `endMatch cleanup error for ${matchId}:`,
                    innerErr
                );
            }

        },
        1000
    );

    } catch (err) {

        console.error(
            `endMatch error for ${matchId}:`,
            err
        );

        try {
            io.to(matchId).emit("error", { message: "Internal server error" });
        } catch (emitErr) {
            console.error("Failed to emit error in endMatch:", emitErr);
        }
    }
}

function startMoveTimer(
    io,
    matchId
) {

    try {

        const oldTimer =
            matchTimers.get(
                matchId
            );

        if (oldTimer) {

            clearTimeout(
                oldTimer
            );
        }

        const timer =
            setTimeout(
                () => {

                    try {

                        console.log(
                            `Move timeout in ${matchId}`
                        );

                        endMatch(
                            io,
                            matchId,
                            "MOVE_TIMEOUT"
                        );

                    } catch (innerErr) {

                        console.error(
                            `startMoveTimer callback error for ${matchId}:`,
                            innerErr
                        );
                    }

                },
                90000
            );

        matchTimers.set(
            matchId,
            timer
        );

    } catch (err) {

        console.error(
            `startMoveTimer error for ${matchId}:`,
            err
        );
    }
}

async function persistMatchResult(
    matchId
) {

    try {

        const match =
            MatchManager.getMatch(
                matchId
            );

        if (!match) {
            return;
        }

        const player1Score =

            match.battingFirstPlayerId ===
            match.player1Id

                ? match.innings1.runs

                : match.innings2.runs;

        const player2Score =

            match.battingFirstPlayerId ===
            match.player2Id

                ? match.innings1.runs

                : match.innings2.runs;

        const player1WicketsLost =

            match.battingFirstPlayerId ===
            match.player1Id

                ? match.innings1.wickets

                : match.innings2.wickets;

        const player2WicketsLost =

            match.battingFirstPlayerId ===
            match.player2Id

                ? match.innings1.wickets

                : match.innings2.wickets;

        const player1OversBatted =

            match.battingFirstPlayerId ===
            match.player1Id

                ? match.overs

                : (

                    match.winnerId ===
                    match.player1Id

                        ? (
                            match.innings2.balls /
                            6
                        )

                        : match.overs
                );

        const player2OversBatted =

            match.battingFirstPlayerId ===
            match.player2Id

                ? match.overs

                : (

                    match.winnerId ===
                    match.player2Id

                        ? (
                            match.innings2.balls /
                            6
                        )

                        : match.overs
                );

        const player1OversBowled =
            player2OversBatted;

        const player2OversBowled =
            player1OversBatted;

        const player1Nrr =

            (
                player1Score /
                player1OversBatted
            )

            -

            (
                player2Score /
                player1OversBowled
            );

        const player2Nrr =

            (
                player2Score /
                player2OversBatted
            )

            -

            (
                player1Score /
                player2OversBowled
            );

        await createMatch({

            id:
                match.matchId,

            player1Id:
                match.player1Id,

            player2Id:
                match.player2Id,

            winnerId:
                match.winnerId,

            status:
                match.status,

            overs:
                match.overs,

            wickets:
                match.wickets,

            battingFirstPlayerId:
                match.battingFirstPlayerId,

            player1Score,

            player2Score,

            player1WicketsLost,

            player2WicketsLost,

            completedAt:
                match.completedAt
        });

        await Promise.all([

            updateUser({

                id:
                    match.player1Id,

                matchesPlayed: {
                    increment: 1
                },

                matchesWon:

                    match.winnerId ===
                    match.player1Id

                        ? {
                            increment: 1
                        }

                        : undefined,

                totalRunsScored: {
                    increment:
                        player1Score
                },

                totalRunsConceded: {
                    increment:
                        player2Score
                },

                netRunRate: {
                    increment:
                        player1Nrr
                }
            }),

            updateUser({

                id:
                    match.player2Id,

                matchesPlayed: {
                    increment: 1
                },

                matchesWon:

                    match.winnerId ===
                    match.player2Id

                        ? {
                            increment: 1
                        }

                        : undefined,

                totalRunsScored: {
                    increment:
                        player2Score
                },

                totalRunsConceded: {
                    increment:
                        player1Score
                },

                netRunRate: {
                    increment:
                        player2Nrr
                }
            })
        ]);

        console.log(
            `Match ${matchId} persisted successfully`
        );

    } catch (err) {

        console.error(
            `persistMatchResult error for ${matchId}:`,
            err
        );
    }
}

module.exports = (io) => {

    io.on(
        "connection",
        (socket) => {

            try {

                console.log(
                    `Socket Connected: ${socket.id}`
                );

            } catch (err) {

                console.error("Error during connection logging:", err);
            }

            socket.on(
    "join-match",
    (data) => {

        try {

            const payload =
                JSON.parse(data);

            const {
                matchId,
                playerId,
                overs,
                wickets
            } = payload;

            let match =
        MatchManager.getMatch(
            matchId
        );

            if (!match) {

                match =
                    MatchManager.createMatch({

                        matchId,

                        player1Id:
                            playerId,

                        overs,

                        wickets
                    });

                console.log(
                    `Match ${matchId} created by ${playerId}`
                );

            } else {

                const isPlayer1 =

                    match.player1Id ===
                    playerId;

                const isPlayer2 =

                    match.player2Id ===
                    playerId;

                const playerAlreadyAssigned =

                    isPlayer1 ||
                    isPlayer2;

                const player2SlotAvailable =

                    match.player2Id ===
                    null;

                if (
                    player2SlotAvailable &&
                    !playerAlreadyAssigned
                ) {

                    MatchManager.joinMatch(
                        matchId,
                        playerId
                    );

                    console.log(
                        `${playerId} joined ${matchId}`
                    );

                } else if (
                    !playerAlreadyAssigned
                ) {

                    socket.emit(
                        "error",
                        {
                            message:
                                "Match is full"
                        }
                    );

                    return;
                }
            }

            socket.join(
                matchId
            );

            if (
                !activeRooms.has(
                    matchId
                )
            ) {

                activeRooms.set(
                    matchId,
                    new Set()
                );
            }

            activeRooms
                .get(matchId)
                .add(playerId);

            const playerCount =

                activeRooms
                    .get(matchId)
                    .size;

            socket.emit(
                "join-match-success",
                {
                    matchId,
                    playerId
                }
            );

            if (
                playerCount === 2
            ) {

                io.to(
                    matchId
                ).emit(
                    "match-ready",
                    {
                        matchId
                    }
                );

                console.log(
                    `Match ${matchId} is READY`
                );

                const tossResult =
                    GameEngine.performToss(
                        matchId
                    );

                io.to(
                    matchId
                ).emit(
                    "toss-result",
                    tossResult
                );

                console.log(
    `Toss Winner: ${tossResult.tossWinnerId}`
);
            }

        } catch (err) {

            console.error("join-match handler error:", err);

            try {
                socket.emit("error", { message: "Internal server error" });
            } catch (emitErr) {
                console.error("Failed to emit error in join-match handler:", emitErr);
            }

            return;
        }
    }
);

//             socket.on(
//     "perform-toss",
//     (data) => {

//         const payload =
//             JSON.parse(data);

//         const {
//             matchId
//         } = payload;

//         const result =
//             GameEngine.performToss(
//                 matchId
//             );

//         io.to(
//             matchId
//         ).emit(
//             "toss-result",
//             result
//         );

//         console.log(
//             `Toss completed for ${matchId}`
//         );
//     }
// );

        socket.on(
    "choose-bat-bowl",
    (data) => {
        try {

            const payload =
                JSON.parse(data);

            const {
                matchId,
                playerId,
                choice
            } = payload;

            const result =
                GameEngine.chooseBatOrBowl(
                    matchId,
                    playerId,
                    choice
                );

            io.to(
                matchId
            ).emit(
                "role-selected",
                {
                    ...result,
                    innings: 1
                }
            );

            console.log(
                `${playerId} chose ${choice} in ${matchId}`
            );

            startMoveTimer(
                io,
                matchId
            );

        } catch (err) {

            console.error("choose-bat-bowl handler error:", err);

            try {
                socket.emit("error", { message: "Internal server error" });
            } catch (emitErr) {
                console.error("Failed to emit error in choose-bat-bowl handler:", emitErr);
            }

            return;
        }
    }
);

    socket.on(
    "submit-move",
    async (data) => {
        try {

            const payload =
                JSON.parse(data);

            const {
                matchId,
                playerId,
                number
            } = payload;

            const match =
                MatchManager.getMatch(
                    matchId
                );

            if (!match) {

                socket.emit(
                    "error",
                    {
                        message:
                            "Match not found"
                    }
                );

                return;
            }

            const batterId =
                match.innings === 1

                    ? match.battingFirstPlayerId

                    : (
                        match.battingFirstPlayerId ===
                        match.player1Id

                            ? match.player2Id

                            : match.player1Id
                    );

            const bowlerId =

                batterId ===
                match.player1Id

                    ? match.player2Id

                    : match.player1Id;

            if (
                playerId === batterId
            ) {

                match.pendingMoves.batter =
                    number;

            } else if (
                playerId === bowlerId
            ) {

                match.pendingMoves.bowler =
                    number;

            } else {

                socket.emit(
                    "error",
                    {
                        message:
                            "Invalid player"
                    }
                );

                return;
            }

            io.to(
                matchId
            ).emit(
                "move-received",
                {
                    playerId
                }
            );

            if (

                match.pendingMoves.batter ===
                null ||

                match.pendingMoves.bowler ===
                null

            ) {

                return;
            }

            const timer =
                matchTimers.get(
                    matchId
                );

            if (timer) {

                clearTimeout(
                    timer
                );
            }

            const result =

                GameEngine.submitMove({

                    matchId,

                    batterNumber:
                        match.pendingMoves.batter,

                    bowlerNumber:
                        match.pendingMoves.bowler
                });

            match.pendingMoves = {

                batter: null,

                bowler: null
            };

            io.to(
                matchId
            ).emit(
                "ball-result",
                result
            );

            if (
                result.matchResult
            ) {

              await  persistMatchResult(
        matchId
    );

                endMatch(
                    io,
                    matchId,
                    "MATCH_COMPLETED"
                );

                return;
            }

            startMoveTimer(
                io,
                matchId
            );

        } catch (err) {

            console.error("submit-move handler error:", err);

            try {
                socket.emit("error", { message: "Internal server error" });
            } catch (emitErr) {
                console.error("Failed to emit error in submit-move handler:", emitErr);
            }

            return;
        }
    }
);

            socket.on(
    "disconnect",
    () => {
        try {

            console.log(
                `Socket Disconnected: ${socket.id}`
            );

            const rooms =

                Array.from(
                    socket.rooms
                );

            rooms.forEach(
                (roomId) => {

                    //console.log(roomId);
                    if (
                        roomId !==
                        socket.id
                    ) {

                        endMatch(
                            io,
                            roomId,
                            "PLAYER_DISCONNECTED"
                        );
                    }
                }
            );

        } catch (err) {

            console.error("disconnect handler error:", err);
        }
    }
);
        }
    );
};


// ---

// # Connection 1 (Player 1)

// ## Send Event

// Event:

// ```text
// join-match
// ```

// Message:

// ```json
// {
//     "matchId": "match1",
//     "playerId": "player1",
//     "overs": 2,
//     "wickets": 5
// }
// ```

// ---

// ## Receive Event

// Event:

// ```text
// join-match-success
// ```

// Message:

// ```json
// {
//     "matchId": "match1",
//     "playerId": "player1"
// }
// ```

// ---

// # Connection 2 (Player 2)

// ## Send Event

// Event:

// ```text
// join-match
// ```

// Message:

// ```json
// {
//     "matchId": "match1",
//     "playerId": "player2",
//     "overs": 2,
//     "wickets": 5
// }
// ```

// ---

// ## Receive Event

// Event:

// ```text
// join-match-success
// ```

// Message:

// ```json
// {
//     "matchId": "match1",
//     "playerId": "player2"
// }
// ```

// ---

// # Both Connections Receive

// Event:

// ```text
// match-ready
// ```

// Message:

// ```json
// {
//     "matchId": "match1"
// }
// ```

// ---

// # Either Connection Sends

// (Currently your code allows either player to trigger toss)

// Event:

// ```text
// perform-toss
// ```

// Message:

// ```json
// {
//     "matchId": "match1"
// }
// ```

// ---

// ## Both Connections Receive

// Event:

// ```text
// toss-result
// ```

// Example:

// ```json
// {
//     "tossWinnerId": "player1"
// }
// ```

// or

// ```json
// {
//     "tossWinnerId": "player2"
// }
// ```

// ---

// # Toss Winner Sends

// If:

// ```json
// {
//     "tossWinnerId": "player1"
// }
// ```

// then Player 1 sends:

// Event:

// ```text
// choose-bat-bowl
// ```

// Message:

// ```json
// {
//     "matchId": "match1",
//     "playerId": "player1",
//     "choice": "BAT"
// }
// ```

// or

// ```json
// {
//     "matchId": "match1",
//     "playerId": "player1",
//     "choice": "BOWL"
// }
// ```

// ---

// # Both Connections Receive

// Event:

// ```text
// role-selected
// ```

// Example if BAT chosen:

// ```json
// {
//     "battingFirstPlayerId": "player1",
//     "innings": 1
// }
// ```

// Example if BOWL chosen:

// ```json
// {
//     "battingFirstPlayerId": "player2",
//     "innings": 1
// }
// ```

// ---

