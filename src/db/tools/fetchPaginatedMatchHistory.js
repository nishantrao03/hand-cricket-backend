// const prisma = require("../prismaClient");

// /**
//  * Fetches a paginated list of match history for a specific user.
//  * * @param {Object} params
//  * @param {string} params.userId - The ID of the user.
//  * @param {number} params.limit - The number of records to fetch.
//  * @param {string} params.sortOrder - 'asc' or 'desc' based on completedAt.
//  * @param {string|null} params.cursor - The ID of the last fetched match (for pagination).
//  * @returns {Promise<{ matches: Array, nextCursor: string|null }>}
//  */
// async function fetchPaginatedMatchHistory({
//     userId,
//     limit = 5,
//     sortOrder = "desc",
//     cursor = null
// }) {
//     try {
//         const matches = await prisma.match.findMany({
//             take: limit,
            
//             skip: cursor ? 1 : 0,
//             cursor: cursor ? { id: cursor } : undefined,
            
//             where: {
//                 OR: [
//                     { player1Id: userId },
//                     { player2Id: userId }
//                 ]
//             },
            
//             orderBy: {
//                 completedAt: sortOrder
//             },
            
//             include: {
//                 player1: { select: { username: true } },
//                 player2: { select: { username: true } },
//                 winner: { select: { username: true } }
//             }
//         });

//         const nextCursor = matches.length === limit ? matches[matches.length - 1].id : null;

//         return {
//             matches,
//             nextCursor
//         };

//     } catch (error) {
//         console.error("DB Tool Error - fetchPaginatedMatchHistory:", error);
//         throw error;
//     }
// }

// module.exports = fetchPaginatedMatchHistory;

const prisma = require("../prismaClient");

/**
 * Fetches a paginated list of match history for a specific user.
 * * @param {Object} params
 * @param {string} params.userId - The ID of the user.
 * @param {number} params.limit - The number of records to fetch.
 * @param {string} params.sortOrder - 'asc' or 'desc' based on completedAt.
 * @param {string|null} params.cursor - The ID of the last fetched match (for pagination).
 * @param {string} params.outcome - 'all', 'win', or 'loss' filter.
 * @returns {Promise<{ matches: Array, nextCursor: string|null }>}
 */
async function fetchPaginatedMatchHistory({
    userId,
    limit = 5,
    sortOrder = "desc",
    cursor = null,
    outcome = "all"
}) {
    try {
        const whereClause = {
            OR: [
                { player1Id: userId },
                { player2Id: userId }
            ]
        };

        if (outcome === "win") {
            whereClause.winnerId = userId;
        } else if (outcome === "loss") {
            whereClause.AND = [
                { winnerId: { not: userId } },
                { winnerId: { not: null } }
            ];
        }

        const matches = await prisma.match.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            where: whereClause,
            orderBy: {
                completedAt: sortOrder
            },
            include: {
                player1: { select: { username: true } },
                player2: { select: { username: true } },
                winner: { select: { username: true } }
            }
        });

        const nextCursor = matches.length === limit ? matches[matches.length - 1].id : null;

        return {
            matches,
            nextCursor
        };

    } catch (error) {
        console.error("DB Tool Error - fetchPaginatedMatchHistory:", error);
        throw error;
    }
}

module.exports = fetchPaginatedMatchHistory;