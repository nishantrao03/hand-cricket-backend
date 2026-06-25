const sendFriendRequest = require('../tools/sendFriendRequest');

(async () => {
  const res = await sendFriendRequest({ senderId: 'evsth9VTpIPVfC86awHp1f2ddeh2', receiverId: 'lzZXn5fpYZekciRDetILPL8Uoi02' });
  console.log('sendFriendRequest result:', res);
})();
