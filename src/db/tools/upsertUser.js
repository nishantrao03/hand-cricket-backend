const prisma = require('../prismaClient');
const { randomUUID } = require('crypto');

module.exports = async function upsert(input) {
  try {
    /* Extract the user ID from the provided input object */
    const { id } = input || {};

    /* Create the user if it doesn't exist, otherwise return the existing user */
    const user = await prisma.user.upsert({
      where: {
        id,
      },
      update: {},
      create: {
        id,
        username: `user#${randomUUID()}`,
      },
    });

    return { success: true, data: user, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};