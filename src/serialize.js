function serializeBoard(board) {
    return JSON.stringify({
        turn: board.turn,

    });
}

module.exports = serializeBoard;