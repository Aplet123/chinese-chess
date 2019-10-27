var board = new StandardBoard();
var ws = new WebSocket("ws://" + window.location.hostname + ":9091");
ws.addEventListener("message", m => console.log(m));