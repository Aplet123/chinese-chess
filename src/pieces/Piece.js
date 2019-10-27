class Piece {
    constructor(x = 0, y = 0, board) {
        if (this.constructor == Piece) {
            throw new Error("Cannot construct abstract class Piece");
        }
        this.x = x;
        this.y = y;
        this.board = board;
    }

    getMoves() {
        return this.filter(this.getMovesNoFilter());
    }

    getMovesNoCheck() {
        return this.filterNoCheck(this.getMovesNoFilter());
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    filter(moves) {
        return moves.filter(v => this.board.isValidMove(this, v));
    }

    filterNoCheck(moves) {
        return moves.filter(v => this.board.isValidMoveNoCheck(this, v));
    }
}

module.exports = Piece;