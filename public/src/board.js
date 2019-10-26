class Board {
    constructor() {
        if (this.constructor == Board) {
            throw new Error("Cannot construct abstract class Board");
        }
        this.coords = new Array(11).fill(0).map(v => new Array(12).fill(null));
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
        if(piece instanceof WhitePiece) {
            return !this.checkLineOfSight(piece, move);
        }
        if(piece instanceof BlackPiece) {
            return !this.checkLineOfSight(piece, move);
        }
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
        this.svg = d3.select("body").append("svg");
        this.svg.attr("width", 1200)
            .attr("height", 1200)
            .attr("viewbox", "0 0 1100 1100")
            .attr("preserveAspectRatio", "xMidYMid meet");
        this.boardGroup = this.svg.append("g");
        this.pieceGroup = this.svg.append("g");
        this.moveGroup = this.svg.append("g");
        this.tileGroup = this.boardGroup.append("g");
        // generate tiles
        for (var i = 0; i < width; i ++) {
            for (var j = 0; j < height; j ++) {
                var tile = this.tileGroup.append("rect")
                    .attr("x", pad + tileSide * i)
                    .attr("y", pad + tileSide * j)
                    .attr("width", tileSide)
                    .attr("height", tileSide)
                    .classed("tile normalstroke", true);
                if (j == river) {
                    tile.classed("nostroke", true);
                    tile.lower();
                }
            }
        }
        // extra thick border around the whole board
        this.boardGroup.append("rect")
            .attr("x", pad)
            .attr("y", pad)
            .attr("width", tileSide * width)
            .attr("height", tileSide * height)
            .attr("fill", "transparent")
            .classed("thickstroke", true);

        // make the two "x"s
        this.boardGroup.append("line")
            .attr("x1", pad + tileSide * crossX)
            .attr("y1", pad + tileSide * crossY)
            .attr("x2", pad + tileSide * (crossX + crossWidth))
            .attr("y2", pad + tileSide * (crossY + crossHeight))
            .classed("normalstroke", true);
        this.boardGroup.append("line")
            .attr("x1", pad + tileSide * (crossX + crossWidth))
            .attr("y1", pad + tileSide * crossY)
            .attr("x2", pad + tileSide * crossX)
            .attr("y2", pad + tileSide * (crossY + crossHeight))
            .classed("normalstroke", true);
        this.boardGroup.append("line")
            .attr("x1", pad + tileSide * crossX)
            .attr("y1", pad + tileSide * (height - crossY - crossHeight))
            .attr("x2", pad + tileSide * (crossX + crossWidth))
            .attr("y2", pad + tileSide * (height - crossY))
            .classed("normalstroke", true);
        this.boardGroup.append("line")
            .attr("x1", pad + tileSide * (crossX + crossWidth))
            .attr("y1", pad + tileSide * (height - crossY - crossHeight))
            .attr("x2", pad + tileSide * crossX)
            .attr("y2", pad + tileSide * (height - crossY))
            .classed("normalstroke", true);
        this.movetext = this.boardGroup.append("text")
            .attr("x", pad)
            .attr("y", 2 * pad + tileSide * height + 50)
            .classed("movetext", true);
        this.updateMovetext();
    }
}

class StandardBoard extends Board {
    constructor() {
        super();
        this.turn = "white";
        this.render(8, 9, 30, 60, 20, 4, 3, 0, 2, 2);
        this.addPiece(WhitePawn, 0, 6);
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
        this.blackKing = this.addPiece(BlackKing, 4, 0);
    }

    movePiece(piece, x, y) {
        super.movePiece(piece, x, y);
        if (this.turn == "white") {
            this.turn = "black";
        } else {
            this.turn = "white";
        }
        this.updateMovetext();
    }

    updateMovetext() {
        if (this.turn == "white") {
            this.movetext.text("White to move.");
        } else if (this.turn == "black") {
            this.movetext.text("Black to move.");
        }
    }
}