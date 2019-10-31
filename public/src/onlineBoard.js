class OnlineStandardBoard extends StandardBoard {
    constructor(ws) {
        super();
        this.ws = ws;
        this.joined = false;
        ws.addEventListener("message", this.handleMessage.bind(this));
    }

    handleMessage(m) {
        var data;
        try {
            data = JSON.parse(m.data);
            console.log("received", data);
        } catch (err) {
            return;
        }
        if (data.ins == "KEY" && !this.joined) {
            this.sendInstruction("JOIN", data.v);
        } else if (data.ins == "BOARD") {
            deserializeBoard(this, data.v);
        }
    }

    sendInstruction(ins, v) {
        console.log("sent", {
            ins: ins,
            v: v
        });
        ws.send(JSON.stringify({
            ins: ins,
            v: v
        }));
    }

    movePiece(piece, x, y) {
        this.sendInstruction("MOVE", [piece.x, piece.y, x, y]);
        super.movePiece(piece, x, y);
    }
}