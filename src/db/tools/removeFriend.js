const prisma = require("../prismaClient");

module.exports = async function removeFriend(input) {

    try {

        const {
            userId,
            friendId
        } = input || {};

        if (!userId || !friendId) {
            return {
                success: false,
                data: null,
                error: "userId and friendId are required"
            };
        }

        const deletedFriendship = await prisma.friend.deleteMany({
            where: {
                OR: [
                    {
                        user1Id: userId,
                        user2Id: friendId
                    },
                    {
                        user1Id: friendId,
                        user2Id: userId
                    }
                ]
            }
        });

        if (deletedFriendship.count === 0) {
            return {
                success: false,
                data: null,
                error: "Users are not friends"
            };
        }

        return {
            success: true,
            data: deletedFriendship,
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