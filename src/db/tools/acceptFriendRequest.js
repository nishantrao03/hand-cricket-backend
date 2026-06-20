const prismaModule = require('../prismaClient');
const prisma = prismaModule && prismaModule.default ? prismaModule.default : prismaModule;

module.exports = async function acceptFriendRequest(input) {
  try {
    const { senderId, receiverId } = input || {};
    if (!senderId || !receiverId) {
      return { success: false, data: null, error: 'senderId and receiverId are required' };
    }

    const fr = await prisma.friendRequest.findFirst({
      where: { senderId, receiverId, status: 'PENDING' },
    });

    if (!fr) {
      return { success: false, data: null, error: 'Pending friend request not found' };
    }

    const updatedFR = await prisma.friendRequest.update({
      where: { id: fr.id },
      data: { status: 'ACCEPTED' },
    });

    // Determine ordering for friend record
    const [user1Id, user2Id] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

    // Check if friend already exists
    let friend = await prisma.friend.findFirst({
      where: { user1Id, user2Id },
    });

    if (!friend) {
      friend = await prisma.friend.create({
        data: { user1Id, user2Id },
      });
    }

    return { success: true, data: { friendRequest: updatedFR, friend }, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};
