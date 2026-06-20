const acceptFriendRequest = require('../tools/acceptFriendRequest');

(async () => {
  const res = await acceptFriendRequest({ senderId: 'test-user-1', receiverId: 'test-user-3' });
  console.log('acceptFriendRequest result:', res);
})();
