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

function rateLimit(
    userId,
    route
) {
    return `rateLimit:${userId}:${route}`;
}

module.exports = {
    user,
    friendRequests,
    friends,
    matchInvitation,
    matchHistory,
    matchStateKey,
    rateLimit
};