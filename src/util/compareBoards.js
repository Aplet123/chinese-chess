function comparePieces (p1, p2) {
    return p1 == p2;
}

function compareBoards (b1, b2) {
    return (b1.turn == b2.turn) && b1.state.every((a, i) => a.every((p, j) => comparePieces(p, b2.state[i][j])));
}

module.exports = compareBoards;
