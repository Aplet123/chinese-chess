var ws;
var board;
var menu = d3.select("#menu");
d3.select("#bSingle").on("click", function() {
    board = new StandardBoard();
    menu.classed("hidden", true);
});
d3.select("#bCreate").on("click", function() {
    ws = new WebSocket(location.href.replace(/http/, "ws"));
    ws.addEventListener("open", function() {
        board = new OnlineStandardBoard(ws);
        board.sendInstruction("CREATE");
    });
    menu.classed("hidden", true);
});
d3.select("#bJoin").on("click", function() {
    ws = new WebSocket(location.href.replace(/http/, "ws"));
    ws.addEventListener("open", function() {
        board = new OnlineStandardBoard(ws);
        board.sendInstruction("JOIN", d3.select("#joinCode").node().value);
    });
    menu.classed("hidden", true);
});
window.addEventListener("beforeunload", function() {
   return "Are you sure?";
});