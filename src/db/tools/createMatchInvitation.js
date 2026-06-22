const prisma = require("../prismaClient");

module.exports = async function createMatchInvitation(input) {

    try {

        const {
            id,
            overs,
            wickets
        } = input || {};

        if (!id || !overs || !wickets) {
            return {
                success: false,
                data: null,
                error: "id, overs and wickets are required"
            };
        }

        const invitation = await prisma.matchInvitation.create({

            data: {
                id,
                overs,
                wickets
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