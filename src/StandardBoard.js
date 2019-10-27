const Board = require("./Board.js");
class StandardBoard extends Board {
    constructor() {
        super();
        this.turn = "white";
        this.render(8, 9, 30, 60, 20, 4, 3, 0, 2, 2);
        /*this.addPiece(WhitePawn, 0, 6);
        this.addPiece(WhitePawn, 2, 6);
        this.addPiece(WhitePawn, 4, 6);
        this.addPiece(WhitePawn, 6, 6);
        this.addPiece(WhitePawn, 8, 6);
        this.addPiece(BlackPawn, 0, 3);
        this.addPiece(BlackPawn, 2, 3);
        this.addPiece(BlackPawn, 4, 3);
        this.addPiece(BlackPawn, 6, 3);
        this.addPiece(BlackPawn, 8, 3);
        this.addPiece(WhiteCannon, 1, 7);
        this.addPiece(WhiteCannon, 7, 7);
        this.addPiece(BlackCannon, 1, 2);
        this.addPiece(BlackCannon, 7, 2);
        this.addPiece(WhiteRook, 0, 9);
        this.addPiece(WhiteRook, 8, 9);
        this.addPiece(BlackRook, 0, 0);
        this.addPiece(BlackRook, 8, 0);
        this.addPiece(WhiteKnight, 1, 9);
        this.addPiece(WhiteKnight, 7, 9);
        this.addPiece(BlackKnight, 1, 0);
        this.addPiece(BlackKnight, 7, 0);
        this.addPiece(WhiteElephant, 2, 9);
        this.addPiece(WhiteElephant, 6, 9);
        this.addPiece(BlackElephant, 2, 0);
        this.addPiece(BlackElephant, 6, 0);
        this.addPiece(WhiteGuard, 3, 9);
        this.addPiece(WhiteGuard, 5, 9);
        this.addPiece(BlackGuard, 3, 0);
        this.addPiece(BlackGuard, 5, 0);
        this.whiteKing = this.addPiece(WhiteKing, 4, 9);
        this.blackKing = this.addPiece(BlackKing, 4, 0);*/
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