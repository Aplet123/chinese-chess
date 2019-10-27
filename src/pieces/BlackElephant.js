const BlackPiece = require("./BlackPiece.js");

class BlackElephant extends BlackPiece {
    constructor(x, y, board) {
        super(x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        // check up left
        if (this.x > 1 && this.y > 1 && this.board.coords[this.x - 1][this.y - 1] == null) {
            ret.push([this.x - 2, this.y - 2]);
        }
        // check down left
        if (this.x > 1 && this.y < (this.board.river - 1) && this.board.coords[this.x - 1][this.y + 1] == null) {
            ret.push([this.x - 2, this.y + 2]);
        }
        // check up right
        if (this.x < (this.board.width - 1) && this.y > 1 && this.board.coords[this.x + 1][this.y - 1] == null) {
            ret.push([this.x + 2, this.y - 2]);
        }
        // check down right
        if (this.x < (this.board.width - 1) && this.y < (this.board.river - 1) && this.board.coords[this.x + 1][this.y + 1] == null) {
            ret.push([this.x + 2, this.y + 2]);
        }
        return ret;
    }
}

module.exports = BlackElephant;