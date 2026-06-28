function user(userId) {
    return `user:${userId}`;
}

function friendRequests(userId) {
    return `friendRequests:${userId}`;
}

function friends(userId) {
    return `friends:${userId}`;
}

function matchInvitation(matchInvitationId) {
    return `matchInvitation:${matchInvitationId}`;
}

function matchHistory(
    userId,
    limit,
    sortOrder,
    cursor,
    outcome
) {
    return `matchHistory:${userId}:${limit}:${sortOrder}:${cursor ?? "null"}:${outcome}`;
}

function matchStateKey(matchId) {
    return `matchState:${matchId}`;
}

module.exports = {
    user,
    friendRequests,
    friends,
    matchInvitation,
    matchHistory,
    matchStateKey
};