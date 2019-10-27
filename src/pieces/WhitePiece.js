const Piece = require("./Piece.js");

class WhitePiece extends Piece {
    constructor(x, y, board) {
        super(x, y, board);
        if (this.constructor == WhitePiece) {
            throw new Error("Cannot construct abstract class WhitePiece");
        }
    }

    canMove() {
        return this.board.turn == "white";
    }

    filter(moves) {
        return super.filter(moves).filter(v => !((this.board.coords[v[0]][v[1]] instanceof WhitePiece)));
    }
}

module.exports = WhitePiece;