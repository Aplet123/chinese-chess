const fs = require("fs");
const path = require("path");
const files = fs.readdirSync(__dirname);
const filename = path.parse(__filename).base;

module.exports = {};

files.forEach(v => {
    const parsed = path.parse(v);
    if (parsed.base != filename && parsed.ext == ".js") {
        module.exports[parsed.name] = require(path.join(__dirname, v));
    }
});
