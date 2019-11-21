var pieces = {
    Piece: Piece,
    WhitePiece: WhitePiece,
    BlackPiece: BlackPiece,
    WhitePawn: WhitePawn,
    BlackPawn: BlackPawn,
    WhiteCannon: WhiteCannon,
    BlackCannon: BlackCannon,
    WhiteElephant: WhiteElephant,
    BlackElephant: BlackElephant,
    WhiteGuard: WhiteGuard,
    BlackGuard: BlackGuard,
    WhiteKing: WhiteKing,
    BlackKing: BlackKing,
    WhiteKnight: WhiteKnight,
    BlackKnight: BlackKnight,
    WhiteRook: WhiteRook,
    BlackRook: BlackRook
};

function deserializeBoard(board, v) {
    var data;
    try {
        data = JSON.parse(v);
    } catch (err) {
        return;
    }
    board.turn = data.turn;
    board.coords = board.coords.map((arr, i) => arr.map((v, j) => {
        let k = data.state[i][j];
        if (k == "" && v != null) {
            v.derender();
            return null;
        } else if (pieces[k] && (!(v instanceof pieces[k]))) {
            if (v != null) {
                v.derender();
            }
            let piece = new pieces[k](i, j, board);
            if (piece instanceof WhiteKing) {
                board.whiteKing = piece;
            }
            if (piece instanceof BlackKing) {
                board.blackKing = piece;
            }
            piece.render();
            return piece;
        }
        return v;
    }));
    /*board.getPieces().forEach(v => v.derender());
    board.coords = data.state.map((arr, i) => arr.map((v, j) => {
        if (pieces[v]) {
            return new pieces[v](i, j, board);
        } else {
            return null;
        }
    }));
    board.getPieces().forEach(v => v.render());*/
    board.updateMovetext();
}