const pieces = require("./util/getPieces.js");

class Board {
    constructor(w, h) {
        if (this.constructor == Board) {
            throw new Error("Cannot construct abstract class Board");
        }
        this.coords = new Array(w).fill(0).map(v => new Array(h).fill(null));
    }

    render(width, height, pad, tileSide, pieceRad, river, crossX, crossY, crossWidth, crossHeight) {
        this.width = width;
        this.height = height;
        this.pad = pad;
        this.tileSide = tileSide;
        this.pieceRad = pieceRad;
        this.river = river;
        this.crossX = crossX;
        this.crossY = crossY;
        this.crossWidth = crossWidth;
        this.crossHeight = crossHeight;
    }

    getPieces() {
        var ret = [];
        for (var i = 0; i < this.coords.length; i ++) {
            for (var j = 0; j < this.coords[i].length; j ++) {
                if (this.coords[i][j] instanceof pieces.Piece) {
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
        if (piece instanceof pieces.BlackPiece && move[0] == this.whiteKing.x && move[1] == this.whiteKing.y) {
            return false;
        }
        if (piece instanceof pieces.WhitePiece && move[0] == this.blackKing.x && move[1] == this.blackKing.y) {
            return false;
        }
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
        if (this.whiteKing.x != this.blackKing.x) {
            return false;
        }
        return isLoS;
    }

    isWhiteCheck(piece, move) {
        var origX, origY, insert;
        if (piece) {
            origX = piece.x;
            origY = piece.y;
            insert = this.movePieceSilent(piece, move[0], move[1]);
        }
        var isCheck = this.getPieces().filter(v => v instanceof pieces.BlackPiece).some(moves => moves.getMovesNoCheck().some(m => m[0] == this.whiteKing.x && m[1] == this.whiteKing.y));
        if (piece) {
            this.movePieceSilent(piece, origX, origY);
        }
        if (insert) {
            this.coords[move[0]][move[1]] = insert;
        }
        return isCheck;
    }

    isBlackCheck(piece, move) {
        var origX, origY, insert;
        if (piece) {
            origX = piece.x;
            origY = piece.y;
            insert = this.movePieceSilent(piece, move[0], move[1]);
        }
        var isCheck = this.getPieces().filter(v => v instanceof pieces.WhitePiece).some(moves => moves.getMovesNoCheck().some(m => m[0] == this.blackKing.x && m[1] == this.blackKing.y));
        if (piece) {
            this.movePieceSilent(piece, origX, origY);
        }
        if (insert) {
            this.coords[move[0]][move[1]] = insert;
        }
        return isCheck;
    }

    isValidMove(piece, move) {
        if(piece instanceof pieces.WhitePiece) {
            return (!this.checkLineOfSight(piece, move)) && (!this.isWhiteCheck(piece, move));
        }
        if(piece instanceof pieces.BlackPiece) {
            return (!this.checkLineOfSight(piece, move)) && (!this.isBlackCheck(piece, move));
        }
    }

    isValidMoveNoCheck(piece, move) {
        if (piece instanceof pieces.WhitePiece) {
            return !this.checkLineOfSight(piece, move);
        }
        if (piece instanceof pieces.BlackPiece) {
            return !this.checkLineOfSight(piece, move);
        }
    }

    checkWhiteMate() {
        if (this.getPieces().filter(v => v instanceof pieces.WhitePiece).every(piece => piece.getMoves().length == 0)) {
            if (this.isWhiteCheck()) {
                return "checkmate";
            }
            return "stalemate";
        }
        return false;
    }

    checkBlackMate() {
        if (this.getPieces().filter(v => v instanceof pieces.BlackPiece).every(piece => piece.getMoves().length == 0)) {
            if (this.isBlackCheck()) {
                return "checkmate";
            }
            return "stalemate";
        }
        return false;
    }
}

module.exports = Board;