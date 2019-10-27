const BlackPiece = require("./BlackPiece.js");

class BlackRook extends BlackPiece {
    constructor(x, y, board) {
        super(x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        // check moves up
        for (var y = this.y - 1; y >= 0; y --) {
            ret.push([this.x, y]);
            if (this.board.coords[this.x][y] != null) {
                break;
            }
        }
        // check moves down
        var blocked = false;
        for (var y = this.y + 1; y <= this.board.height; y ++) {
            ret.push([this.x, y]);
            if (this.board.coords[this.x][y] != null) {
                break;
            }
        }
        // check moves left
        var blocked = false;
        for (var x = this.x - 1; x >= 0; x --) {
            ret.push([x, this.y]);
            if (this.board.coords[x][this.y] != null) {
                break;
            }
        }
        // check moves right
        var blocked = false;
        for (var x = this.x + 1; x <= this.board.width; x ++) {
            ret.push([x, this.y]);
            if (this.board.coords[x][this.y] != null) {
                break;
            }
        }
        return ret;
    }
}

module.exports = BlackRook;