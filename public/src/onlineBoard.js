class OnlineStandardBoard extends StandardBoard {
    constructor(ws) {
        super();
        this.ws = ws;
        ws.addEventListener("message", function(m) {
            console.log(m);
        });
    }

    sendInstruction(ins, v) {
        ws.send(JSON.stringify({
            ins: ins,
            v: v
        }));
    }

    movePiece(piece, x, y) {
        super.movePiece(piece, x, y);
        this.sendInstruction("MOVE", [piece.constructor.name, x, y]);
    }
}