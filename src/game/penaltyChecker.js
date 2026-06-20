function hasPenalty(history) {

    if (history.length < 3) {
        return false;
    }

    const len = history.length;

    return (
        history[len - 1] === history[len - 2] &&
        history[len - 2] === history[len - 3]
    );
}

module.exports = hasPenalty;