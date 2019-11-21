class OnlineStandardBoard extends StandardBoard {
    constructor(ws) {
        super();
        this.ws = ws;
        this.joined = false;
        ws.addEventListener("message", this.handleMessage.bind(this));
        this.sidebar = d3.select("#flex").append("div").classed("sidebar", true);
        this.curKeyDisp = this.sidebar.append("p");
        this.otherKeyDisp = this.sidebar.append("p");
    }

    handleMessage(m) {
        var data;
        try {
            data = JSON.parse(m.data);
            console.log("received", data);
        } catch (err) {
            return;
        }
        if (data.ins == "KEY") {
            if (!this.joined) {
                this.sendInstruction("JOIN", data.v);
            }
            this.curKeyDisp.text("Key to rejoin: " + data.v);
        } else if (data.ins == "BOARD") {
            deserializeBoard(this, data.v);
        } else if (data.ins == "SIDE") {
            this.side = data.v;
            this.updateMovetext();
        } else if (data.ins == "JOINED") {
            if (data.v) {
                this.joined = true;
            } else {
                alert("Error joining, key is likely wrong");
                location.reload();
            }
        } else if (data.ins == "OTHERKEY") {
            this.otherKeyDisp.text("Key to invite friend: " + data.v);
        } else if (data.ins == "LASTMOVE") {
            this.arrowGroup.html("");
            this.arrowGroup.append("line")
                .attr("x1", data.v[0] * this.tileSide + this.pad)
                .attr("y1", data.v[1] * this.tileSide + this.pad)
                .attr("x2", data.v[2] * this.tileSide + this.pad)
                .attr("y2", data.v[3] * this.tileSide + this.pad)
                .classed("moveArrow", true);
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
        super.movePiece(piece, x, y);
        this.sendInstruction("MOVE", [piece.x, piece.y, x, y]);
    }

    updateMovetext() {
        if (this.turn == "white") {
            this.movetext.text(`You are ${this.side}. White to move.`);
        } else if (this.turn == "black") {
            this.movetext.text(`You are ${this.side}. Black to move.`);
        }
    }
}