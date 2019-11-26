const express = require("express");
require("dotenv").config();
const WebSocket = require("ws");
const connection = require("./src/WSHandle.js");
const app = express();
const port = process.env.PORT || 9090;

app.use(function (req, res, next) {
    // prevent caching for development purposes
    res.set({
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    });
    next();
});

app.use(express.static("./public"));

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
}, 15000);
console.log("Listening on port " + port);