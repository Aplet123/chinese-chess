var ws = new WebSocket("ws://" + window.location.hostname + ":9091");
var board = new OnlineStandardBoard(ws);
ws.addEventListener("message", m => console.log(m));