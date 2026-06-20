const prisma = require('../prismaClient');

module.exports = async function fetchMatch(input) {
    console.log(input);
  try {
    console.log(input);
    const { id } = input || {};


    if (!id) {
      return { success: false, data: null, error: 'id is required' };
    }

    const match = await prisma.match.findUnique({
      where: { id }
    //   include: { player1: true, player2: true, winner: true },
    });

    if (!match) {
      return { success: false, data: null, error: 'Match not found' };
    }

    return { success: true, data: match, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};
