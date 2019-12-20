const fs = require("fs");
const path = require("path");
const piecePath = path.join(__dirname, "../pieces");
const files = fs.readdirSync(piecePath);

module.exports = {};

files.forEach(v => {
    const parsed = path.parse(v);
    if (parsed.ext == ".js") {
        module.exports[parsed.name] = require(path.join(piecePath, v));
    }
});
