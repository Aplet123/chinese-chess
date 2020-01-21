class Board {
    constructor(w, h) {
        if (this.constructor == Board) {
            throw new Error("Cannot construct abstract class Board");
        }
        this.coords = new Array(w).fill(0).map(v => new Array(h).fill(null));
        this.shouldFlip = false;
        this.rendered = false;
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
        return newPiece;
    }

    scaleX(coord) {
        return coord * this.tileSide + this.pad;
    }

    scaleY(coord) {
        if (this.shouldFlip) {
            return (this.height - coord) * this.tileSide + this.pad;
        }
        return coord * this.tileSide + this.pad;
    }

    movePiece(piece, x, y) {
        this.coords[piece.x][piece.y] = null; 
        if (this.coords[x][y] != null) {
            this.removePiece(this.coords[x][y]);
        }
        this.arrowGroup.html("");
        this.arrowGroup.append("line")
            .attr("x1", this.scaleX(piece.x))
            .attr("y1", this.scaleY(piece.y))
            .attr("x2", this.scaleX(x))
            .attr("y2", this.scaleY(y))
            .classed("moveArrow", true);
        piece.move(x, y);
        this.coords[x][y] = piece;
        piece.render();
        this.checkWinCon();
        this.whiteKing.tag.classed("check", this.isWhiteCheck());
        this.blackKing.tag.classed("check", this.isBlackCheck());
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
        if (piece instanceof BlackPiece && move[0] == this.whiteKing.x && move[1] == this.whiteKing.y) {
            return false;
        }
        if (piece instanceof WhitePiece && move[0] == this.blackKing.x && move[1] == this.blackKing.y) {
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
        if (this.whiteKing.x != this.blackKing.x) {
            isLoS = false;
        }
        this.movePieceSilent(piece, origX, origY);
        if (insert) {
            this.coords[move[0]][move[1]] = insert;
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
        if (piece instanceof WhitePiece) {
            return (!this.checkLineOfSight(piece, move)) && (!this.isWhiteCheck(piece, move));
        }
        if (piece instanceof BlackPiece) {
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

    checkWinCon() {
        if (this.checkWhiteMate() == "checkmate") {
            this.showDialog("White has been checkmated! Black wins!", leavePage);
        } else if (this.checkWhiteMate() == "stalemate") {
            this.showDialog("White has been stalemated! Draw!", leavePage);
        } else if (this.checkBlackMate() == "checkmate") {
            this.showDialog("Black has been checkmated! White wins!", leavePage);
        } else if (this.checkBlackMate() == "stalemate") {
            this.showDialog("Black has been stalemated! Draw!", leavePage);
        }
    }

    showDialog(txt, onClose) {
        if (onClose) {
            this.onDialogClose = onClose;
        } else {
            this.onDialogClose = function() {
                this.hideDialog();
            };
        }
        this.dialogBase.classed("hidden", false);
        this.dialogText.text(txt);
    }

    hideDialog() {
        this.dialogBase.classed("hidden", true);
    }

    updateDimensions() {
        this.svg.attr("height", innerHeight - 5);
        this.dialogBase.style("height", innerHeight - 5 + "px")
            .style("width", this.svg.node().getBoundingClientRect().width - 10 + "px");
    }

    clearMoves() {
        this.moveGroup.html("");
        if (this.selected) {
            this.selected.classed("selected", false);
            this.selected = null;
        }
    }

    config(width, height, pad, tileSide, pieceRad, river, crossX, crossY, crossWidth, crossHeight, viewbox) {
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
        this.viewbox = viewbox;
    }

    render() {
        if (this.rendered) {
            return;
        }
        var cur = this;
        this.flexParent = d3.select("body").append("div").classed("flex", true);
        this.svg = this.flexParent.append("svg");
        this.svg.attr("viewBox", this.viewbox)
            .attr("preserveAspectRatio", "xMidYMid meet");
        this.dialogBase = this.flexParent.append("div")
            .classed("dialogBase hidden", true);
        this.dialogBox = this.dialogBase.append("div")
            .classed("dialogBox", true);
        this.dialogText = this.dialogBox.append("p");
        this.closeDialog = this.dialogBox.append("button").text("Close");
        this.closeDialog.on("click", function() {
            cur.onDialogClose();
        });
        window.addEventListener("resize", function() {
           cur.updateDimensions();
        });
        this.updateDimensions();
        this.boardGroup = this.svg.append("g");
        this.arrowGroup = this.svg.append("g");
        this.pieceGroup = this.svg.append("g");
        this.moveGroup = this.svg.append("g");
        this.selected = null;
        this.boardGroup.on("click", function() {
            cur.clearMoves();
        });

        // fill for background
        this.boardGroup.append("rect")
            .attr("x", this.pad)
            .attr("y", this.pad)
            .attr("width", this.tileSide * this.width)
            .attr("height", this.tileSide * this.height)
            .classed("tile nostroke", true);

        this.tileGroup = this.boardGroup.append("g");

        // generate tiles
        for (var i = 0; i < this.width; i ++) {
            for (var j = 0; j < this.height; j ++) {
                var tile = this.tileGroup.append("rect")
                    .attr("x", this.scaleX(i))
                    .attr("y", this.scaleY(this.shouldFlip ? (j + 1) : j))
                    .attr("width", this.tileSide)
                    .attr("height", this.tileSide)
                    .classed("tile normalstroke", true);
                if (j == this.river) {
                    tile.classed("nostroke", true);
                    tile.lower();
                }
            }
        }
        // extra thick border around the whole board
        this.boardGroup.append("rect")
            .attr("x", this.pad)
            .attr("y", this.pad)
            .attr("width", this.tileSide * this.width)
            .attr("height", this.tileSide * this.height)
            .attr("fill", "transparent")
            .classed("thickstroke", true);

        // make the two "x"s
        this.boardGroup.append("line")
            .attr("x1", this.scaleX(this.crossX))
            .attr("y1", this.scaleY(this.crossY))
            .attr("x2", this.scaleX(this.crossX + this.crossWidth))
            .attr("y2", this.scaleY(this.crossY + this.crossHeight))
            .classed("normalstroke", true);
        this.boardGroup.append("line")
            .attr("x1", this.scaleX(this.crossX + this.crossWidth))
            .attr("y1", this.scaleY(this.crossY))
            .attr("x2",this.scaleX(this.crossX))
            .attr("y2", this.scaleY(this.crossY + this.crossHeight))
            .classed("normalstroke", true);
        this.boardGroup.append("line")
            .attr("x1", this.scaleX(this.crossX))
            .attr("y1", this.scaleY(this.height - this.crossY - this.crossHeight))
            .attr("x2", this.scaleX(this.crossX + this.crossWidth))
            .attr("y2", this.scaleY(this.height - this.crossY))
            .classed("normalstroke", true);
        this.boardGroup.append("line")
            .attr("x1", this.scaleX(this.crossX + this.crossWidth))
            .attr("y1", this.scaleY(this.height - this.crossY - this.crossHeight))
            .attr("x2", this.scaleX(this.crossX))
            .attr("y2", this.scaleY(this.height - this.crossY))
            .classed("normalstroke", true);
        this.movetext = this.boardGroup.append("text")
            .attr("x", this.pad)
            .attr("y", 2 * this.pad + this.tileSide * this.height + 50)
            .classed("movetext", true);
        var pieces = this.getPieces();
        for (var i = 0; i < pieces.length; i ++) {
            pieces[i].render();
        }
        this.updateMovetext();
        if (settings.promptclose.value) {
            window.onbeforeunload = function () {
                return "yes";
            };
        }
        if (settings.blindfold.value) {
            this.pieceGroup.classed("blind", true);
            this.moveGroup.classed("blind", true);
        }
        this.rendered = true;
    }
}

class StandardBoard extends Board {
    constructor() {
        super(9, 10);
        this.turn = "white";
        this.config(8, 9, 30, 60, 23, 4, 3, 0, 2, 2, "0 0 600 700");
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
        this.movetext.text(`${getNameCaps(this.turn)} to move.`);
    }
}