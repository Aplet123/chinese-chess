const BoardManager = require("./BoardManager.js");
const bm = new BoardManager();
const serialize = require("./serialize.js");

function connection (ws) {
    function sendInstruction(ins, v) {
        ws.send(JSON.stringify({
            ins,
            v
        }));
    }
    let key;
    ws.on("message", function (msg) {
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
                sendInstruction("JOINED", true);
                sendInstruction("BOARD", serialize(bm.getBoard(key)));
            } else {
                sendInstruction("JOINED", false);
            }
        } else if (data.ins == "GETOTHERKEY") {
            if (key) {
                sendInstruction("OTHERKEY", bm.getOtherKey(key));
            }
        } else if (data.ins == "MOVE") {
            if (key) {
                if (data.v instanceof Array && data.v.length >= 4) {
                    bm.move(key, data.v[0], data.v[1], data.v[2], data.v[3]);
                    bm.sendAll(key, "BOARD", serialize(bm.getBoard(key)));
                }
            }
        }
    });
}

module.exports = connection;