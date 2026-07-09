const prisma = require("../prismaClient");

module.exports = async function createMatch(input) {

    try {

        const ids = [
            input.player1Id,
            input.player2Id
        ];

        if (input.winnerId) {
            ids.push(input.winnerId);
        }

        const users =
            await prisma.user.findMany({

                where: {
                    id: {
                        in: [...new Set(ids)]
                    }
                }
            });

        const expectedUsers =
            input.winnerId
                ? new Set(ids).size
                : 2;

        if (
            users.length !== expectedUsers
        ) {

            return {
                success: false,
                data: null,
                error: "One or more users not found"
            };
        }

        const created =
            await prisma.match.create({
                data: input
            });

        return {
            success: true,
            data: created,
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