const WhitePiece = require("./WhitePiece.js");

class WhiteKing extends WhitePiece {
    constructor(x, y, board) {
        super(x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        // check left
        if (this.x > this.board.crossX) {
            ret.push([this.x - 1, this.y]);
        }
        // check right
        if (this.x < this.board.crossX + this.board.crossWidth) {
            ret.push([this.x + 1, this.y]);
        }
        // check up
        if (this.y > this.board.height - this.board.crossY - this.board.crossHeight) {
            ret.push([this.x, this.y - 1]);
        }
        // check down
        if (this.y < this.board.height - this.board.crossY) {
            ret.push([this.x, this.y + 1]);
        }
        return ret;
    }
}

module.exports = WhiteKing;