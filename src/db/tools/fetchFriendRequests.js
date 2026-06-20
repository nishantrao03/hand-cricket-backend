const prisma = require('../prismaClient');

module.exports = async function fetchFriendRequests(input) {
  try {
    const { userId } = input || {};
    if (!userId) {
      return { success: false, data: null, error: 'userId is required' };
    }

    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: { sender: true },
    });

    return { success: true, data: requests, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};
