const acceptFriendRequest = require('../tools/acceptFriendRequest');

(async () => {
  const res = await acceptFriendRequest({ senderId: 'evsth9VTpIPVfC86awHp1f2ddeh2', receiverId: 'lzZXn5fpYZekciRDetILPL8Uoi02' });
  console.log('acceptFriendRequest result:', res);
})();
