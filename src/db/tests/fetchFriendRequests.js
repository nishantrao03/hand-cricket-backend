const fetchFriendRequests = require('../tools/fetchFriendRequests');

(async () => {
  const res = await fetchFriendRequests({ userId: 'test-user-3' });
  console.log('fetchFriendRequests result:', res);
})();

