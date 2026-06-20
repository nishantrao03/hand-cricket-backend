const prismaModule = require('../prismaClient');
const prisma = prismaModule && prismaModule.default ? prismaModule.default : prismaModule;

module.exports = async function sendFriendRequest(input) {
  try {
    const { senderId, receiverId } = input || {};

    if (!senderId || !receiverId) {
      return { success: false, data: null, error: 'senderId and receiverId are required' };
    }

    if (senderId === receiverId) {
      return { success: false, data: null, error: 'Cannot send friend request to self' };
    }

    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });

    if (!sender || !receiver) {
      return { success: false, data: null, error: 'Sender or receiver not found' };
    }

    // Check existing pending request
    const existing = await prisma.friendRequest.findFirst({
      where: { senderId, receiverId, status: 'PENDING' },
    });

    if (existing) {
      return { success: false, data: null, error: 'Pending request already exists' };
    }

    // Check if already friends (either order)
    const alreadyFriends = await prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      },
    });

    if (alreadyFriends) {
      return { success: false, data: null, error: 'Users are already friends' };
    }

    const created = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING',
      },
    });

    return { success: true, data: created, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};
