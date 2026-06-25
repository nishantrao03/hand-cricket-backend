const prisma = require('../prismaClient');

// Processes a friend request between two users, validating inputs
// and checking for existing relationships before creation.
module.exports = async function sendFriendRequest(input) {
  try {
    const { senderId, receiverId } = input || {};

    // Validates that both required identifiers are provided
    if (!senderId || !receiverId) {
      return {
        success: false,
        data: null,
        error: 'senderId and receiverId are required'
      };
    }

    // Prevents a user from initiating a relationship with themselves
    if (senderId === receiverId) {
      return {
        success: false,
        data: null,
        error: 'Cannot send friend request to self'
      };
    }

    // Queries the database for an existing pending friend request
    // between the two users in either direction to prevent duplicates.
    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
        status: 'PENDING',
      },
    });

    // Halts execution if a pending request is already active
    if (existing) {
      return {
        success: false,
        data: null,
        error: 'Pending request already exists'
      };
    }

    // Checks for an already established friend relationship
    // in either direction to prevent redundant requests
    const alreadyFriends = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            user1Id: senderId,
            user2Id: receiverId
          },
          {
            user1Id: receiverId,
            user2Id: senderId
          }
        ]
      }
    });

    // Halts execution if the users are already connected
    if (alreadyFriends) {
      return {
        success: false,
        data: null,
        error: 'Users are already friends'
      };
    }

    // Generates the new pending friend request record
    const created = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });

    // Returns the successfully created record
    return {
      success: true,
      data: created,
      error: null
    };

  } catch (err) {
    // Captures and returns any database constraints or execution errors
    return {
      success: false,
      data: null,
      error: err.message || String(err)
    };
  }
};