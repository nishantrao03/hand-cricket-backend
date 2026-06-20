const prismaModule = require('../prismaClient');
const prisma = prismaModule && prismaModule.default ? prismaModule.default : prismaModule;

module.exports = async function createMatch(input) {
  try {
    const data = input || {};

    const requiredUsers = ['player1Id', 'player2Id'];
    for (const key of requiredUsers) {
      if (!data[key]) {
        return { success: false, data: null, error: `${key} is required` };
      }
    }

    // Validate existence of players
    const p1 = await prisma.user.findUnique({ where: { id: data.player1Id } });
    const p2 = await prisma.user.findUnique({ where: { id: data.player2Id } });

    if (!p1 || !p2) {
      return { success: false, data: null, error: 'player1Id or player2Id not found' };
    }

    if (data.winnerId) {
      const w = await prisma.user.findUnique({ where: { id: data.winnerId } });
      if (!w) {
        return { success: false, data: null, error: 'winnerId not found' };
      }
    }

    // Prepare payload using exact schema field names
    const payload = {
      id: data.id,
      player1Id: data.player1Id,
      player2Id: data.player2Id,
      winnerId: data.winnerId || null,
      status: data.status || 'COMPLETED',
      overs: data.overs,
      wickets: data.wickets,
      battingFirstPlayerId: data.battingFirstPlayerId || null,
      player1Score: data.player1Score || 0,
      player2Score: data.player2Score || 0,
      player1WicketsLost: data.player1WicketsLost || 0,
      player2WicketsLost: data.player2WicketsLost || 0,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    };

    // Remove undefined keys so Prisma uses defaults
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const created = await prisma.match.create({ data: payload });

    return { success: true, data: created, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};
