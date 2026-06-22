const prisma = require("../prismaClient");

module.exports = async function deleteMatchInvitation(input) {

    try {

        const { id } = input || {};

        const invitation =

            await prisma.matchInvitation.delete({

                where: {
                    id
                }
            });

        return {
            success: true,
            data: invitation,
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