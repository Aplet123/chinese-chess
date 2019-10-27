const Board = require("./Board.js");
const pieces = require("./getPieces.js");

class StandardBoard extends Board {
    constructor() {
        super();
        this.turn = "white";
        this.render(8, 9, 30, 60, 20, 4, 3, 0, 2, 2);
        this.addPiece(pieces.WhitePawn, 0, 6);
        this.addPiece(pieces.WhitePawn, 2, 6);
        this.addPiece(pieces.WhitePawn, 4, 6);
        this.addPiece(pieces.WhitePawn, 6, 6);
        this.addPiece(pieces.WhitePawn, 8, 6);
        this.addPiece(pieces.BlackPawn, 0, 3);
        this.addPiece(pieces.BlackPawn, 2, 3);
        this.addPiece(pieces.BlackPawn, 4, 3);
        this.addPiece(pieces.BlackPawn, 6, 3);
        this.addPiece(pieces.BlackPawn, 8, 3);
        this.addPiece(pieces.WhiteCannon, 1, 7);
        this.addPiece(pieces.WhiteCannon, 7, 7);
        this.addPiece(pieces.BlackCannon, 1, 2);
        this.addPiece(pieces.BlackCannon, 7, 2);
        this.addPiece(pieces.WhiteRook, 0, 9);
        this.addPiece(pieces.WhiteRook, 8, 9);
        this.addPiece(pieces.BlackRook, 0, 0);
        this.addPiece(pieces.BlackRook, 8, 0);
        this.addPiece(pieces.WhiteKnight, 1, 9);
        this.addPiece(pieces.WhiteKnight, 7, 9);
        this.addPiece(pieces.BlackKnight, 1, 0);
        this.addPiece(pieces.BlackKnight, 7, 0);
        this.addPiece(pieces.WhiteElephant, 2, 9);
        this.addPiece(pieces.WhiteElephant, 6, 9);
        this.addPiece(pieces.BlackElephant, 2, 0);
        this.addPiece(pieces.BlackElephant, 6, 0);
        this.addPiece(pieces.WhiteGuard, 3, 9);
        this.addPiece(pieces.WhiteGuard, 5, 9);
        this.addPiece(pieces.BlackGuard, 3, 0);
        this.addPiece(pieces.BlackGuard, 5, 0);
        this.whiteKing = this.addPiece(pieces.WhiteKing, 4, 9);
        this.blackKing = this.addPiece(pieces.BlackKing, 4, 0);
    }

    movePiece(piece, x, y) {
        super.movePiece(piece, x, y);
        if (this.turn == "white") {
            this.turn = "black";
        } else {
            this.turn = "white";
        }
    }
}

module.exports = StandardBoard;