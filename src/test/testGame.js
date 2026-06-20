const MatchManager =
require("../game/matchManager");

const GameEngine =
require("../game/gameEngine");

MatchManager.deleteMatch("match1");

MatchManager.createMatch({

    matchId: "match1",

    player1Id: "player1",

    overs: 2,

    wickets: 5
});

MatchManager.joinMatch(
    "match1",
    "player2"
);

const toss =
GameEngine.performToss(
    "match1"
);

console.log(
    "\n--- TOSS ---"
);

console.log(
    toss
);

const role =
GameEngine.chooseBatOrBowl(
    "match1",
    toss.tossWinnerId,
    "BAT"
);

console.log(
    "\n--- ROLE ---"
);

console.log(
    role
);

function playBall(
    batterNumber,
    bowlerNumber
) {

    const result =
        GameEngine.submitMove({

            matchId: "match1",

            batterNumber,

            bowlerNumber
        });

    console.log(
        result
    );
}

console.log(
    "\n========== MATCH START ==========\n"
);

playBall(5, 2);
playBall(5, 4);
playBall(5, 1);
playBall(3, 1);
playBall(0, 1);
playBall(5, 5);
playBall(4, 2);
playBall(6, 1);
playBall(2, 2);
playBall(3, 5);
playBall(1, 1);
playBall(6, 6);

playBall(4, 1);
playBall(5, 3);
playBall(0, 6);
playBall(2, 4);
playBall(3, 3);
playBall(6, 2);
playBall(1, 5);
playBall(4, 4);
playBall(5, 2);
playBall(6, 3);
playBall(2, 6);
playBall(3, 1);
playBall(5, 4);

console.log(
    "\n========== FINAL MATCH STATE ==========\n"
);

console.dir(
    MatchManager.getMatch(
        "match1"
    ),
    {
        depth: null
    }
);