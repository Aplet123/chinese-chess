const WhitePiece = require("./WhitePiece.js");

class WhiteKnight extends WhitePiece {
    constructor(x, y, board) {
        super(x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        // check moves up
        if (this.y > 1 && this.board.coords[this.x][this.y - 1] == null) {
            if (this.x > 0) {
                ret.push([this.x - 1, this.y - 2]);
            }
            if (this.x < this.board.width) {
                ret.push([this.x + 1, this.y - 2]);
            }
        }
        // check moves down
        if (this.y < (this.board.height - 1) && this.board.coords[this.x][this.y + 1] == null) {
            if (this.x > 0) {
                ret.push([this.x - 1, this.y + 2]);
            }
            if (this.x < this.board.width) {
                ret.push([this.x + 1, this.y + 2]);
            }
        }
        // check moves left
        if (this.x > 1 && this.board.coords[this.x - 1][this.y] == null) {
            if (this.y > 0) {
                ret.push([this.x - 2, this.y - 1]);
            }
            if (this.y < 9) {
                ret.push([this.x - 2, this.y + 1]);
            }
        }
        // check moves right
        if (this.x < (this.board.width - 1) && this.board.coords[this.x + 1][this.y] == null) {
            if (this.y > 0) {
                ret.push([this.x + 2, this.y - 1]);
            }
            if (this.y < 9) {
                ret.push([this.x + 2, this.y + 1]);
            }
        }
        return ret;
    }
}

module.exports = WhiteKnight;