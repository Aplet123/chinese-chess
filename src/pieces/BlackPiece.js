const Piece = require("./Piece.js");

class BlackPiece extends Piece {
    constructor(x, y, board) {
        super(x, y, board);
        if (this.constructor == BlackPiece) {
            throw new Error("Cannot construct abstract class BlackPiece");
        }
    }

    canMove() {
        return this.board.turn == "black";
    }

    filter(moves) {
        return super.filter(moves).filter(v => !((this.board.coords[v[0]][v[1]] instanceof BlackPiece)));
    }
}

module.exports = BlackPiece;