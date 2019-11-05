const express = require("express");
require("dotenv").config();
const WebSocket = require("ws");
const connection = require("./src/WSHandle.js");
const app = express();
const wss = new WebSocket.Server({
    port: process.env.WS_PORT || 9091
});
wss.on("connection", connection);
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

app.listen(port);
console.log("Listening on port " + port);