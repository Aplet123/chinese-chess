const WhitePiece = require("./WhitePiece.js");

class WhitePawn extends WhitePiece {
    constructor(x, y, board) {
        super(x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        if (this.y > 0) {
            ret.push([this.x, this.y - 1]);
        }
        if (this.y <= this.board.river) {
            if (this.x > 0) {
                ret.push([this.x - 1, this.y]);
            }
            if (this.x < this.board.width) {
                ret.push([this.x + 1, this.y]);
            }
        }
        return ret;
    }
}

module.exports = WhitePawn;