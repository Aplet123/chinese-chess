const express = require("express");
require("dotenv").config();
const WebSocket = require("ws");
const app = express();
const port = process.env.PORT || 9090;

const BoardManager = require("./src/BoardManager.js");
const bm = new BoardManager();
const connection = require("./src/WSHandle.js").init(bm).connection;

const expireTime = 1000 * 60 * 30;

app.use(function (req, res, next) {
    // prevent caching for development purposes
    res.set({
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    });
    next();
});

app.use("/game/:key", function (req, res) {
    let key = req.params.key;
    let board = bm.getBoard(key);
    res.contentType("application/json");
    if (key && board) {
        res.send(JSON.stringify({
            status: "Success"
        }));
    } else {
        res.status(400);
        res.send(JSON.stringify({
            error: "Board not found"
        }));
    }
});

app.use(express.static("public"));

app.use(function (req, res) {
    res.status(404);
    res.contentType("text/plain");
    res.send("Sorry! Page not found!");
});

const server = app.listen(port);
const wss = new WebSocket.Server({
    server
});
wss.on("connection", connection);
setInterval(function() {
    wss.clients.forEach(function(c) {
        if (c.alive) {
            c.alive = false;
            c.ping();
        } else {
            c.terminate();
        }
    });
    bm.boards.forEach(b => {
        if (b.whitePlayer || b.blackPlayer) {
            b.expires = Date.now() + expireTime;
        } else if (Date.now() > b.expires) {
            bm.deleteBoard(b);
        }
    });
}, 15000);
console.log("Listening on port " + port);