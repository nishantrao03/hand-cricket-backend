function getWicketsLost(number) {

    if (number === 0) {
        return 0;
    }

    if (number === 3 || number === 4) {
        return 1;
    }

    if (number === 2 || number === 5) {
        return 2;
    }

    if (number === 1 || number === 6) {
        return 3;
    }

    return 0;
}

module.exports = getWicketsLost;