const prisma = require('../prismaClient');

module.exports = async function declineFriendRequest(input) {
    try {
        const { senderId, receiverId } = input || {};
        
        if (!senderId || !receiverId) {
            return { success: false, data: null, error: 'senderId and receiverId are required' };
        }

        // Directly delete without checking first. 
        // deleteMany is used because Prisma requires a unique identifier (like id) for standard delete().
        const result = await prisma.friendRequest.deleteMany({
            where: {
                senderId,
                receiverId,
                status: 'PENDING'
            }
        });

        // result.count tells us how many records were actually deleted
        if (result.count === 0) {
            return { success: false, data: null, error: 'Friend request not found or already processed' };
        }

        return { success: true, data: { message: 'Friend request declined and removed successfully' }, error: null };
        
    } catch (err) {
        return { success: false, data: null, error: err.message || String(err) };
    }
};