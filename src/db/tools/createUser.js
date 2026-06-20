const prisma = require('../prismaClient');

module.exports = async function createUser(input) {
  try {
    /* Extract all relevant user fields from the provided input object */
    const { 
      id, 
      username, 
      country, 
      favoriteTeam, 
      discordUsername, 
      bio 
    } = input || {};

    /* Pass the extracted dynamic values to the Prisma creation payload */
    const created = await prisma.user.create({
      data: {
        id,
        username,
        country,
        favoriteTeam,
        discordUsername,
        bio,
      },
    });

    return { success: true, data: created, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};