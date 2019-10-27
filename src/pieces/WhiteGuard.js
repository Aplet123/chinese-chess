const WhitePiece = require("./WhitePiece.js");

class WhiteGuard extends WhitePiece {
    constructor(x, y, board) {
        super(x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        // check up left
        if (this.x > this.board.crossX && this.y > this.board.height - this.board.crossY - this.board.crossHeight) {
            ret.push([this.x - 1, this.y - 1]);
        }
        // check down left
        if (this.x > this.board.crossX && this.y < (this.board.height - this.board.crossY)) {
            ret.push([this.x - 1, this.y + 1]);
        }
        // check up right
        if (this.x < (this.board.crossX + this.board.crossWidth) && this.y > this.board.height - this.board.crossY - this.board.crossHeight) {
            ret.push([this.x + 1, this.y - 1]);
        }
        // check down right
        if (this.x < (this.board.crossX + this.board.crossWidth) && this.y < (this.board.height - this.board.crossY)) {
            ret.push([this.x + 1, this.y + 1]);
        }
        return ret;
    }
}

module.exports = WhiteGuard;