function connection (ws) {
    function sendInstruction(ins, v) {
        ws.send(JSON.stringify({
            ins,
            v
        }));
    }
    ws.on("message", function (msg) {
        let data;
        try {
            data = JSON.parse(msg);
        } catch (err) {
            return;
        }
        if (data.ins == "CREATE") {
            let newBoard = new StandardBoard();
            if (Math.random() < 0.5) {
                sendInstruction("KEY", newBoard.whiteKey);
            } else {
                sendInstruction("KEY", newBoard.blackKey);
            }
            boards.push(newBoard);
        } else if (data.ins == "MOVE") {
            console.log(data.v);
        }
    });
}

module.exports = connection;