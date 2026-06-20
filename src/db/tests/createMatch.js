const createMatch = require('../tools/createMatch');

(async () => {
  const res = await createMatch({
    id: 'match-db-1',
    player1Id: 'test-user-1',
    player2Id: 'test-user-2',
    winnerId: 'test-user-1',
    status: 'COMPLETED',
    overs: 2,
    wickets: 5,
    battingFirstPlayerId: 'test-user-1',
    player1Score: 10,
    player2Score: 8,
    player1WicketsLost: 1,
    player2WicketsLost: 2,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  });

  console.log('createMatch result:', res);
})();
