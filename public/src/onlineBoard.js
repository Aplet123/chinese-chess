class OnlineStandardBoard extends StandardBoard {
    constructor(ws) {
        super();
        this.ws = ws;
        this.joined = false;
        ws.addEventListener("message", this.handleMessage.bind(this));
        this.sidebar = this.flexParent.append("div").classed("sidebar", true);
        this.curKeyDisp = this.sidebar.append("p");
        this.otherKeyDisp = this.sidebar.append("p");
        this.chat = this.sidebar.append("div").classed("chat", true);
        this.chatMesses = this.chat.append("div");
        this.chatInput = this.chat.append("input")
            .attr("placeholder", "Send chat message here...");
        var cur = this;
        this.chatInput.on("keydown", function() {
            if (d3.event.code == "Enter") {
                var inp = this.value;
                if (inp[0] == "/") {
                    // start processing commands
                    var parsed = inp.substr(1).split` `;
                    var cmd = parsed[0].toLowerCase();
                    if (cmd in commands) {
                        cmd = commands[cmd];
                        var args = parsed.slice(1)
                        if (checkProper(args, cmd)) {
                            var ret = cmd.cmd.apply(cur, args);
                            if (ret) {
                                cur.displayMessage(ret);
                            }
                        } else {
                            cur.displayMessage({
                                italics: true,
                                message: `Invalid syntax, usage: ${formatCommand(cmd)}`
                            });
                        }
                    } else {
                        cur.displayMessage({
                            italics: true,
                            message: "Command not found. Type /help for a list of commands."
                        });
                    }
                } else {
                    cur.sendInstruction("SENDCHAT", this.value);
                }
                this.value = "";
            }
        });
        this.displayMessage({
            italics: true,
            message: "Welcome to the chat! Type /help for a list of commands."
        });
    }

    displayMessage(ops) {
        ops = Object.assign({
            italics: false,
            title: null,
            message: null
        }, ops);
        this.chatMesses.append("p")
            .html((ops.title ? `<span class="title">${escapeHTML(ops.title)}: </span>` : "") + escapeHTML(ops.message))
            .classed("italics", ops.italics);
        this.chatMesses.node().scroll(0, this.chatMesses.property("scrollHeight"));
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
            this.curKeyDisp.html(`Key to rejoin: <a href="#${escapeHTML(data.v)}">${escapeHTML(data.v)}</a>`);
        } else if (data.ins == "BOARD") {
            deserializeBoard(this, data.v);
        } else if (data.ins == "SIDE") {
            this.side = data.v;
            this.updateMovetext();
        } else if (data.ins == "JOINED") {
            if (data.v) {
                this.joined = true;
            } else {
                this.showDialog("Error joining, key is likely wrong", leavePage);
            }
        } else if (data.ins == "OTHERKEY") {
            this.otherKeyDisp.html(`Key to invite friend: <a href="#${escapeHTML(data.v)}">${escapeHTML(data.v)}</a>`);
        } else if (data.ins == "LASTMOVE") {
            this.arrowGroup.html("");
            this.arrowGroup.append("line")
                .attr("x1", data.v[0] * this.tileSide + this.pad)
                .attr("y1", data.v[1] * this.tileSide + this.pad)
                .attr("x2", data.v[2] * this.tileSide + this.pad)
                .attr("y2", data.v[3] * this.tileSide + this.pad)
                .classed("moveArrow", true);
        } else if (data.ins == "OP_JOINED") {
            this.displayMessage({
                italics: true,
                message: "Opponent has joined the room."
            });
        } else if (data.ins == "OP_DC") {
            this.displayMessage({
                italics: true,
                message: "Opponent has left the room."
            });
        } else if (data.ins == "CHAT") {
            var title;
            if (data.v.side == this.side) {
                title = "You";
            } else {
                title = "Opponent";
            }
            this.displayMessage({
                title: title,
                message: data.v.message
            });
        } else if (data.ins == "WINCON") {
            var parsed = data.v.split`_`;
            this.showDialog(`${parsed[0] == "white" ? "White" : "Black"} has been ${parsed[1]}d! ${parsed[1] == "checkmate" ? ((parsed[0] == "white" ? "Black" : "White") + "wins") : "Draw"}!`, leavePage);
            if (data.v == "white_checkmate") {
                this.showDialog("White has been checkmated! Black wins!", leavePage);
            } else if (data.v == "white_stalemate") {
                this.showDialog("White has been stalemated! Draw!", leavePage);
            } else if (data.v == "black_checkmate") {
                this.showDialog("Black has been checkmated! White wins!", leavePage);
            } else if (data.v == "black_stalemate") {
                this.showDialog("Black has been stalemated! Draw!", leavePage);
            } else if (data.v == "white_forfeit") {
                this.showDialog("White has forfeited! Black wins!", leavePage);
            } else if (data.v == "black_forfeit") {
                this.showDialog("Black has forfeited! White wins!", leavePage);
            } else if (data.v == "both_draw") {
                this.showDialog("Players have agreed to a draw! Draw!", leavePage);
            }
        } else if (data.ins == "OP_DRAW") {
            this.displayMessage({
                italics: true,
                message: "Opponent has offered a draw. Type /draw to accept."
            });
        } else if (data.ins == "DRAW_CANCEL") {
            this.displayMessage({
                italics: true,
                message: "Draw offer has been cancelled."
            });
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

    updateMovetext() {
        if (this.turn == "white") {
            this.movetext.text(`You are ${this.side}. White to move.`);
        } else if (this.turn == "black") {
            this.movetext.text(`You are ${this.side}. Black to move.`);
        }
    }

    checkWinCon() {
        // do nothing
    }
}