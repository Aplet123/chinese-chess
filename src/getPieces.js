const fs = require("fs");
let pieces = fs.readdirSync("./src/pieces");
module.exports = {};
for (let file of pieces) {
    if (file.match(/\.js$/i)) {
        let piece = require("./pieces/" + file);
        module.exports[file.replace(/\.js$/i, "")] = piece;
    }
}