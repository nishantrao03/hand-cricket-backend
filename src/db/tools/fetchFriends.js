const prisma = require('../prismaClient');

module.exports = async function fetchFriends(input) {
  try {
    const { userId } = input || {};
    if (!userId) {
      return { success: false, data: null, error: 'userId is required' };
    }

    const friends = await prisma.friend.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: { user1: true, user2: true },
    });

    return { success: true, data: friends, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};
