class Board {
    constructor() {
        if (this.constructor == Board) {
            throw new Error("Cannot construct abstract class Board");
        }
        this.coords = new Array(11).fill(0).map(v => new Array(12).fill(null));
        this.whiteKey = genKey();
        this.blackKey = genKey();
    }

    render() {

    }

    getPieces() {
        var ret = [];
        for (var i = 0; i < this.coords.length; i ++) {
            for (var j = 0; j < this.coords[i].length; j ++) {
                if (this.coords[i][j] instanceof Piece) {
                    ret.push(this.coords[i][j]);
                }
            }
        }
        return ret;
    }

    addPiece(pieceType, x, y) {
        var newPiece = new pieceType(x, y, this);
        this.coords[x][y] = newPiece;
        newPiece.render();
        return newPiece;
    }

    movePiece(piece, x, y) {
        this.coords[piece.x][piece.y] = null;
        if (this.coords[x][y] != null) {
            this.removePiece(this.coords[x][y]);
        }
        piece.move(x, y);
        this.coords[x][y] = piece;
        piece.render();
    }

    movePieceSilent(piece, x, y) {
        this.coords[piece.x][piece.y] = null;
        var removed;
        if (this.coords[x][y] != null) {
            removed = this.removePieceSilent(this.coords[x][y]);
        }
        piece.move(x, y);
        this.coords[x][y] = piece;
        return removed;
    }

    removePiece(piece) {
        this.coords[piece.x][piece.y] = null;
        piece.derender();
    }

    removePieceSilent(piece) {
        this.coords[piece.x][piece.y] = null;
        return piece;
    }

    checkLineOfSight(piece, move) {
        var origX = piece.x;
        var origY = piece.y;
        var insert = this.movePieceSilent(piece, move[0], move[1]);
        var isLoS = true;
        for (var i = Math.min(this.whiteKing.y, this.blackKing.y) + 1; i < Math.max(this.whiteKing.y, this.blackKing.y); i ++) {
            if (this.coords[this.whiteKing.x][i] != null) {
                isLoS = false;
            }
        }
        this.movePieceSilent(piece, origX, origY);
        if (insert) {
            this.coords[move[0]][move[1]] = insert;
        }
        return isLoS;
    }

    isWhiteCheck(piece, move) {
        var origX = piece.x;
        var origY = piece.y;
        var insert = this.movePieceSilent(piece, move[0], move[1]);
        var isCheck = this.getPieces().filter(v => v instanceof BlackPiece).some(moves => moves.getMovesNoCheck().some(m => m[0] == this.whiteKing.x && m[1] == this.whiteKing.y));
        this.movePieceSilent(piece, origX, origY);
        if (insert) {
            this.coords[move[0]][move[1]] = insert;
        }
        return isCheck;
    }

    isBlackCheck(piece, move) {
        var origX = piece.x;
        var origY = piece.y;
        var insert = this.movePieceSilent(piece, move[0], move[1]);
        var isCheck = this.getPieces().filter(v => v instanceof WhitePiece).some(moves => moves.getMovesNoCheck().some(m => m[0] == this.blackKing.x && m[1] == this.blackKing.y));
        this.movePieceSilent(piece, origX, origY);
        if (insert) {
            this.coords[move[0]][move[1]] = insert;
        }
        return isCheck;
    }

    isValidMove(piece, move) {
        if(piece instanceof WhitePiece) {
            return (!this.checkLineOfSight(piece, move)) && (!this.isWhiteCheck(piece, move));
        }
        if(piece instanceof BlackPiece) {
            return (!this.checkLineOfSight(piece, move)) && (!this.isBlackCheck(piece, move));
        }
    }

    isValidMoveNoCheck(piece, move) {
        if (piece instanceof WhitePiece) {
            return !this.checkLineOfSight(piece, move);
        }
        if (piece instanceof BlackPiece) {
            return !this.checkLineOfSight(piece, move);
        }
    }
}

module.exports = Board;