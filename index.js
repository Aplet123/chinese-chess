const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("./public"));

app.listen(port);
console.log("Listening on port " + port);