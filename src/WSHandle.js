const WebSocket = require("ws");
const serialize = require("./util/serialize.js");

function init (bm) {
    function connection(ws) {
        function sendInstruction(ins, v) {
            ws.send(JSON.stringify({
                ins,
                v
            }));
        }

        let key;
        ws.on("message", function (msg) {
            if (ws.readyState == WebSocket.CLOSED || ws.readyState == WebSocket.CLOSING) {
                return;
            }
            let data;
            try {
                data = JSON.parse(msg);
            } catch (err) {
                return;
            }
            if (data.ins == "CREATE") {
                sendInstruction("KEY", bm.createBoard());
            } else if (data.ins == "JOIN") {
                if (bm.isAvailable(data.v)) {
                    key = data.v;
                    bm.join(key, ws);
                    sendInstruction("SIDE", bm.getSide(key));
                    if (bm.getBoard(key)) {
                        sendInstruction("BOARD", serialize(bm.getBoard(key)));
                    }
                    sendInstruction("OTHERKEY", bm.getOtherKey(key));
                    sendInstruction("SPECKEY", bm.getSpecKey(key));
                    sendInstruction("JOINED", true);
                    bm.sendOther(key, "OP_JOINED");
                } else {
                    sendInstruction("JOINED", false);
                }
            } else if (data.ins == "GETOTHERKEY") {
                if (key) {
                    sendInstruction("OTHERKEY", bm.getOtherKey(key));
                }
            } else if (data.ins == "GETKEY") {
                if (key) {
                    sendInstruction("KEY", key);
                }
            } else if (data.ins == "MOVE") {
                if (key) {
                    if (data.v instanceof Array && data.v.length >= 4) {
                        data.v = data.v.map(v => parseInt(v, 10));
                        bm.move(key, data.v[0], data.v[1], data.v[2], data.v[3]);
                    }
                }
            } else if (data.ins == "SENDCHAT") {
                if (key) {
                    if ((typeof data.v == "string") && data.v.length <= 200 && data.v.length > 0) {
                        bm.sendAll(key, "CHAT", {
                            side: bm.getSide(key),
                            message: data.v
                        });
                    }
                }
            } else if (data.ins == "FORFEIT") {
                if (key) {
                    let board = bm.getBoard(key);
                    let side = bm.getSide(key);
                    if (board && side) {
                        bm.sendAll(key, "WINCON", side + "_forfeit");
                        bm.deleteBoard(board);
                    }
                }
            } else if (data.ins == "DRAW") {
                if (key) {
                    let board = bm.getBoard(key);
                    let side = bm.getSide(key);
                    if (board && side) {
                        if (!(board.blackDraw || board.whiteDraw)) {
                            bm.sendOther(key, "OP_DRAW");
                        }
                        if (side == "black") {
                            board.blackDraw = true;
                        } else {
                            board.whiteDraw = true;
                        }
                        if (board.blackDraw && board.whiteDraw) {
                            bm.sendAll(key, "WINCON", "both_draw");
                        }
                    }
                }
            }
        });
        ws.on("close", function () {
            bm.sendOther(key, "OP_DC");
            bm.leave(key);
        });
        // close broken connections
        ws.alive = true;
        ws.on("pong", function () {
            this.alive = true;
        });
    }

    return {
        connection
    };
}

module.exports = {
    init
};