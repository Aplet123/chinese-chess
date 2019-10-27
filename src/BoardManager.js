const StandardBoard = require("./StandardBoard.js");

class BoardManager {
    constructor() {
        this.boards = [];
        this.curKey = 0;
    }

    leftPad(str, len, char) {
        return char.repeat(Math.max(0, len - str.length)) + str;
    }

    genKey() {
        this.curKey ++;
        if (this.curKey >= parseInt("1000000", 36)) {
            this.curKey = 0;
        }
        return leftPad(this.curKey.toString(36).toUpperCase(), 6, "0");
    }

    createBoard() {
        let newBoard = new StandardBoard();
        newBoard.whitePlayer = false;
        newBoard.blackPlayer = false;
        boards.push(newBoard);
        if (Math.random() < 0.5) {
            return newBoard.whiteKey;
        } else {
            return newBoard.blackKey;
        }
    }

    getBoard(key) {
        return this.boards.find(v => v.whiteKey == key || v.blackKey == key);
    }

    getSide(key) {
        let board = getBoard(key);
        if (board) {
            if (key == board.whiteKey) {
                return "white";
            } else {
                return "black";
            }
        }
        return null;
    }

    getOtherKey(key) {
        let board = getBoard(key);
        let side = getSide(key);
        if (side == "white") {
           return board.blackKey;
        } else if (side == "black" ){
            return board.whiteKey;
        }
    }

    join(key) {
        let board = getBoard(key);
        let side = getSide(key);
        if (side == "white") {
            board.whitePlayer = true;
        } else if (side == "black" ){
            board.blackPlayer = true;
        }
    }

    leave(key) {
        let board = getBoard(key);
        let side = getSide(key);
        if (side == "white") {
            board.whitePlayer = false;
        } else if (side == "black" ){
            board.blackPlayer = false;
        }
    }
}

module.exports = BoardManager;