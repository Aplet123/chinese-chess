const pieces = require("./getPieces");

function serializePiece(piece) {
    if (piece == null) {
        return "";
    }
    return piece.constructor.name;
}

function serializeBoard(board) {
    return {
        turn: board.turn,
        state: board.coords.map(arr => arr.map(v => serializePiece(v)))
    };
}

module.exports = serializeBoard;