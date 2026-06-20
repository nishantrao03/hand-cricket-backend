const prisma = require('../prismaClient');

module.exports = async function fetchMatchHistoryForUser(input) {
  try {
    const { userId } = input || {};
    if (!userId) {
      return { success: false, data: null, error: 'userId is required' };
    }

    const matches = await prisma.match.findMany({
      where: { OR: [{ player1Id: userId }, { player2Id: userId }] },
      include: { player1: true, player2: true, winner: true },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: matches, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};
