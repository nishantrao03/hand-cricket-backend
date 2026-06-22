const prisma = require("../prismaClient");

module.exports = async function fetchMatchInvitation(input) {

    try {

        const { id } = input || {};

        const invitation =

            await prisma.matchInvitation.findUnique({

                where: {
                    id
                }
            });

        if (!invitation) {

            return {
                success: false,
                data: null,
                error: "Match invitation not found"
            };
        }

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