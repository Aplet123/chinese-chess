const WhitePiece = require("./WhitePiece.js");

class WhiteCannon extends WhitePiece {
    constructor(x, y, board) {
        super(x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        // check moves up
        var blocked = false;
        for (var y = this.y - 1; y >= 0; y --) {
            if (this.board.coords[this.x][y] == null) {
                if (!blocked) {
                    ret.push([this.x, y]);
                }
            } else {
                if (blocked) {
                    if (this.board.coords)
                        ret.push([this.x, y]);
                    break;
                }
                blocked = true;
            }
        }
        // check moves down
        var blocked = false;
        for (var y = this.y + 1; y <= this.board.height; y ++) {
            if (this.board.coords[this.x][y] == null) {
                if (!blocked) {
                    ret.push([this.x, y]);
                }
            } else {
                if (blocked) {
                    ret.push([this.x, y]);
                    break;
                }
                blocked = true;
            }
        }
        // check moves left
        var blocked = false;
        for (var x = this.x - 1; x >= 0; x --) {
            if (this.board.coords[x][this.y] == null) {
                if (!blocked) {
                    ret.push([x, this.y]);
                }
            } else {
                if (blocked) {
                    ret.push([x, this.y]);
                    break;
                }
                blocked = true;
            }
        }
        // check moves right
        var blocked = false;
        for (var x = this.x + 1; x <= this.board.width; x ++) {
            if (this.board.coords[x][this.y] == null) {
                if (!blocked) {
                    ret.push([x, this.y]);
                }
            } else {
                if (blocked) {
                    ret.push([x, this.y]);
                    break;
                }
                blocked = true;
            }
        }
        return ret;
    }
}

module.exports = WhiteCannon;