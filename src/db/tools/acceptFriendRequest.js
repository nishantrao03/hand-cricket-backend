const prisma = require('../prismaClient');

// Processes the acceptance of a friend request, creating a friend record
// and removing the pending request securely within a database transaction.
module.exports = async function acceptFriendRequest(input) {
  try {
    const { senderId, receiverId } = input || {};

    // Validates the presence of required user identifiers
    if (!senderId || !receiverId) {
      return {
        success: false,
        data: null,
        error: 'senderId and receiverId are required'
      };
    }

    // Executes the creation and deletion operations atomically
    const friend = await prisma.$transaction(async (tx) => {
      // Normalizes user IDs to maintain consistent composite keys
      const [user1Id, user2Id] =
        senderId < receiverId
          ? [senderId, receiverId]
          : [receiverId, senderId];

      // Establishes the friendship record first
      const newFriend = await tx.friend.upsert({
        where: {
          user1Id_user2Id: {
            user1Id,
            user2Id
          }
        },
        update: {},
        create: {
          user1Id,
          user2Id
        }
      });

      // Removes the pending friend request after friendship establishment
      const deletedFR = await tx.friendRequest.deleteMany({
        where: {
          senderId,
          receiverId,
          status: 'PENDING'
        }
      });

      // Triggers a transaction rollback if no pending request was found
      if (deletedFR.count === 0) {
        throw new Error('Pending friend request not found');
      }

      return newFriend;
    });

    // Returns the newly established friendship data
    console.log("FRIEND");
    console.log(friend);
    return {
      success: true,
      data: {
        friend
      },
      error: null
    };

  } catch (err) {
    // Intercepts transaction rollbacks or general execution errors
    return {
      success: false,
      data: null,
      error: err.message || String(err)
    };
  }
};