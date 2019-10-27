const express = require("express");
require("dotenv").config();
const WebSocket = require("ws");
const StandardBoard = require("./src/StandardBoard.js");
const app = express();
const wss = new WebSocket.Server({
    port: process.env.WS_PORT || 9091
});
const boards = [];
wss.on("connection", function(ws) {
    function sendInstruction(ins, v) {
        ws.send(JSON.stringify({
            ins,
            v
        }));
    }
    ws.on("message", function(msg) {
        var data = JSON.parse(msg);
        if (data.ins == "CREATE") {
            let newBoard = new StandardBoard();
            if (Math.random() < 0.5) {
                sendInstruction("KEY", newBoard.whiteKey);
            } else {
                sendInstruction("KEY", newBoard.blackKey);
            }
            boards.push(newBoard);
        }
    });
});
const port = process.env.PORT || 9090;

app.use(express.static("./public"));

app.listen(port);
console.log("Listening on port " + port);