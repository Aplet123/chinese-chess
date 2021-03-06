class Piece {
    constructor(def, x = 0, y = 0, board) {
        if (this.constructor == Piece) {
            throw new Error("Cannot construct abstract class Piece");
        }
        this.def = def;
        this.x = x;
        this.y = y;
        this.tag = null;
        this.board = board;
    }

    getMoves() {
        return this.filter(this.getMovesNoFilter());
    }

    getMovesNoCheck() {
        return this.filterNoCheck(this.getMovesNoFilter());
    }

    showMoves() {
        if (this.canMove()) {
            this.board.clearMoves();
            var moves = this.getMoves();
            var cur = this;
            moves.map(v => {
                this.board.moveGroup.append("circle")
                    .classed("moveIndicator", true)
                    .attr("cx", this.board.scaleX(v[0]))
                    .attr("cy", this.board.scaleY(v[1]))
                    .attr("r", this.board.pieceRad)
                    .on("click", function() {
                        cur.board.clearMoves();
                        cur.board.movePiece(cur, v[0], v[1]);
                    });
            });
        } else {
            this.board.clearMoves();
            var moves = this.getMoves();
            var cur = this;
            moves.map(v => {
                this.board.moveGroup.append("circle")
                    .classed("moveIndicatorGrey", true)
                    .attr("cx", this.board.scaleX(v[0]))
                    .attr("cy", this.board.scaleY(v[1]))
                    .attr("r", this.board.pieceRad)
                    .on("click", function() {
                        cur.board.clearMoves();
                    });
            });
        }
        if (this.board.selected) {
            this.board.selected.classed("selected", false);
        }
        this.board.selected = this.tag;
        this.board.selected.classed("selected", true);
    }

    render() {
        if (this.tag == null) {
            this.tag = this.board.pieceGroup.append("use");
            var cur = this;
            this.tag.on("click", function() {
                cur.showMoves();
            });
            this.tag.attr("href", this.def);
        }
        var end = `translate(${this.board.scaleX(this.x)} ${this.board.scaleY(this.y)}) scale(${this.board.pieceRad / 100})`;
        if (settings.anims.value && this.tag.attr("transform")) {
            this.tag.transition()
                .duration(200)
                .attr("transform", end);
        } else {
            this.tag.attr("transform", end);
        }
    }

    derender() {
        if (this.tag != null) {
            this.tag.remove();
        }
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

class WhitePiece extends Piece {
    constructor(def, x, y, board) {
        super(def, x, y, board);
        if (this.constructor == WhitePiece) {
            throw new Error("Cannot construct abstract class WhitePiece");
        }
    }

    canMove() {
        if (this.board.side) {
            return this.board.turn == this.board.side && this.board.turn == "white";
        }
        return this.board.turn == "white";
    }

    filter(moves) {
        return super.filter(moves).filter(v => !((this.board.coords[v[0]][v[1]] instanceof WhitePiece)));
    }
}

class BlackPiece extends Piece {
    constructor(def, x, y, board) {
        super(def, x, y, board);
        if (this.constructor == BlackPiece) {
            throw new Error("Cannot construct abstract class BlackPiece");
        }
    }

    canMove() {
        if (this.board.side) {
            return this.board.turn == this.board.side && this.board.turn == "black";
        }
        return this.board.turn == "black";
    }

    filter(moves) {
        return super.filter(moves).filter(v => !((this.board.coords[v[0]][v[1]] instanceof BlackPiece)));
    }
}

class WhitePawn extends WhitePiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/whitepawn.svg#piece", x, y, board);
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

class BlackPawn extends BlackPiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/blackpawn.svg#piece", x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        if (this.y < this.board.height) {
            ret.push([this.x, this.y + 1]);
        }
        if (this.y >= this.board.river + 1) {
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

class WhiteCannon extends WhitePiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/whitecannon.svg#piece", x, y, board);
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

class BlackCannon extends BlackPiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/blackcannon.svg#piece", x, y, board);
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

class WhiteRook extends WhitePiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/whiterook.svg#piece", x, y, board);
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

class BlackRook extends BlackPiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/blackrook.svg#piece", x, y, board);
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

class WhiteKnight extends WhitePiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/whiteknight.svg#piece", x, y, board);
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
            if (this.y < this.board.height) {
                ret.push([this.x - 2, this.y + 1]);
            }
        }
        // check moves right
        if (this.x < (this.board.width - 1) && this.board.coords[this.x + 1][this.y] == null) {
            if (this.y > 0) {
                ret.push([this.x + 2, this.y - 1]);
            }
            if (this.y < this.board.height) {
                ret.push([this.x + 2, this.y + 1]);
            }
        }
        return ret;
    }
}

class BlackKnight extends BlackPiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/blackknight.svg#piece", x, y, board);
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
            if (this.y < this.board.height) {
                ret.push([this.x - 2, this.y + 1]);
            }
        }
        // check moves right
        if (this.x < (this.board.width - 1) && this.board.coords[this.x + 1][this.y] == null) {
            if (this.y > 0) {
                ret.push([this.x + 2, this.y - 1]);
            }
            if (this.y < this.board.height) {
                ret.push([this.x + 2, this.y + 1]);
            }
        }
        return ret;
    }
}

class WhiteElephant extends WhitePiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/whiteelephant.svg#piece", x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        // check up left
        if (this.x > 1 && this.y > (this.board.river + 1) && this.board.coords[this.x - 1][this.y - 1] == null) {
            ret.push([this.x - 2, this.y - 2]);
        }
        // check down left
        if (this.x > 1 && this.y < (this.board.height - 1) && this.board.coords[this.x - 1][this.y + 1] == null) {
            ret.push([this.x - 2, this.y + 2]);
        }
        // check up right
        if (this.x < (this.board.width - 1) && this.y > (this.board.river + 1) && this.board.coords[this.x + 1][this.y - 1] == null) {
            ret.push([this.x + 2, this.y - 2]);
        }
        // check down right
        if (this.x < (this.board.width - 1) && this.y < (this.board.height - 1) && this.board.coords[this.x + 1][this.y + 1] == null) {
            ret.push([this.x + 2, this.y + 2]);
        }
        return ret;
    }
}

class BlackElephant extends BlackPiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/blackelephant.svg#piece", x, y, board);
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

class WhiteGuard extends WhitePiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/whiteguard.svg#piece", x, y, board);
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

class BlackGuard extends BlackPiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/blackguard.svg#piece", x, y, board);
    }

    getMovesNoFilter() {
        var ret = [];
        // check up left
        if (this.x > this.board.crossX && this.y > 0) {
            ret.push([this.x - 1, this.y - 1]);
        }
        // check down left
        if (this.x > this.board.crossX && this.y < (this.board.crossHeight + this.board.crossY)) {
            ret.push([this.x - 1, this.y + 1]);
        }
        // check up right
        if (this.x < (this.board.crossX + this.board.crossWidth) && this.y > 0) {
            ret.push([this.x + 1, this.y - 1]);
        }
        // check down right
        if (this.x < (this.board.crossX + this.board.crossWidth) && this.y < (this.board.crossHeight + this.board.crossY)) {
            ret.push([this.x + 1, this.y + 1]);
        }
        return ret;
    }
}

class WhiteKing extends WhitePiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/whiteking.svg#piece", x, y, board);
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

class BlackKing extends BlackPiece {
    constructor(x, y, board) {
        super("/pieces" + suffix + "/blackking.svg#piece", x, y, board);
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
        if (this.y > this.board.crossY) {
            ret.push([this.x, this.y - 1]);
        }
        // check down
        if (this.y < this.board.crossY + this.board.crossHeight) {
            ret.push([this.x, this.y + 1]);
        }
        return ret;
    }
}