var ws;
var board;
var menu = d3.select("#menu");
d3.select("#bSingle").on("click", function () {
    board = new StandardBoard();
    menu.classed("hidden", true);
});
d3.select("#bCreate").on("click", function () {
    ws = new WebSocket(`${location.protocol.replace(/^http/, "ws")}//${location.host}`);
    ws.addEventListener("open", function() {
        board = new OnlineStandardBoard(ws);
        board.sendInstruction("CREATE");
    });
    menu.classed("hidden", true);
});
d3.select("#bJoin").on("click", function () {
    ws = new WebSocket(`${location.protocol.replace(/^http/, "ws")}//${location.host}`);
    ws.addEventListener("open", function() {
        board = new OnlineStandardBoard(ws);
        board.sendInstruction("JOIN", d3.select("#joinCode").property("value"));
    });
    menu.classed("hidden", true);
});
if (location.hash.length > 1) {
    d3.select("#joinCode").property("value", location.hash.substr(1));
    d3.select("#bJoin").dispatch("click");
}
