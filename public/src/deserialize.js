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
    board.getPieces().forEach(v => v.derender());
    board.coords = data.state.map((arr, i) => arr.map((v, j) => {
        if (pieces[v]) {
            return new pieces[v](i, j, board);
        } else {
            return null;
        }
    }));
    board.getPieces().forEach(v => v.render());
}