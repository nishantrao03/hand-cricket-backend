const fetchFriends = require('../tools/fetchFriends');

(async () => {
  const res = await fetchFriends({ userId: 'test-user-1' });
  console.log('fetchFriends result:', res);
})();
