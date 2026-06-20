const prisma = require('../prismaClient');

module.exports = async function fetchUser(input) {
  try {
    const { id } = input || {};

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { success: false, data: null, error: 'User not found' };
    }

    return { success: true, data: user, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message || String(err) };
  }
};
