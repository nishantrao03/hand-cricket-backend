const prisma = require('../prismaClient');

module.exports = async function updateUser(input) {
  try {

    const { id, ...data } = input || {};

    if (!id) {
      return {
        success: false,
        data: null,
        error: 'id is required'
      };
    }

    if (Object.keys(data).length === 0) {
      return {
        success: false,
        data: null,
        error: 'No updatable fields provided'
      };
    }

    const updated =
      await prisma.user.update({
        where: { id },
        data
      });

    return {
      success: true,
      data: updated,
      error: null
    };

  } catch (err) {

    return {
      success: false,
      data: null,
      error: err.message || String(err)
    };
  }
};