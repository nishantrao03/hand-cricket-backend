const fetchMatchHistoryForUser = require('../tools/fetchMatchHistoryForUser');

(async () => {
  const res = await fetchMatchHistoryForUser({ userId: 'test-user-1' });
  console.log('fetchMatchHistoryForUser result:', res);
})();
