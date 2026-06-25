const declineFriendRequest = require('../tools/declineFriendRequest');

async function runTest() {
    console.log("Testing declineFriendRequest tool...");
    
    const result = await declineFriendRequest({
        senderId: 'evsth9VTpIPVfC86awHp1f2ddeh2', receiverId: 'lzZXn5fpYZekciRDetILPL8Uoi02'
    });
    
    console.log("Test Result:", result);
}

runTest();