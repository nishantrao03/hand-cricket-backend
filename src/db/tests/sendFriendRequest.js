const sendFriendRequest = require('../tools/sendFriendRequest');

(async () => {
  const res = await sendFriendRequest({ senderId: 'test-user-1', receiverId: 'test-user-3' });
  console.log('sendFriendRequest result:', res);
})();
