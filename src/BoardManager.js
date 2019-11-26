const StandardBoard = require("./StandardBoard.js");

class BoardManager {
    constructor() {
        this.boards = [];
        this.curKey = Math.floor(Math.random() * parseInt("zzzzza", 36));
    }

    leftPad(str, len, char) {
        return char.repeat(Math.max(0, len - str.length)) + str;
    }

    genKey() {
        this.curKey ++;
        if (this.curKey >= parseInt("1000000", 36)) {
            this.curKey = 0;
        }
        return this.leftPad(this.curKey.toString(36).toUpperCase(), 6, "0");
    }

    createBoard() {
        let newBoard = new StandardBoard();
        newBoard.whitePlayer = false;
        newBoard.blackPlayer = false;
        newBoard.whiteKey = this.genKey();
        newBoard.blackKey = this.genKey();
        newBoard.whiteWS = null;
        newBoard.blackWS = null;
        this.boards.push(newBoard);
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
        let board = this.getBoard(key);
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
        let board = this.getBoard(key);
        let side = this.getSide(key);
        if (board && side && side == "white") {
           return board.blackKey;
        } else if (board && side && side == "black" ){
            return board.whiteKey;
        }
    }

    join(key, ws) {
        let board = this.getBoard(key);
        let side = this.getSide(key);
        if (side == "white") {
            board.whitePlayer = true;
            board.whiteWS = ws;
        } else if (side == "black" ){
            board.blackPlayer = true;
            board.blackWS = ws;
        }
    }

    leave(key) {
        let board = this.getBoard(key);
        let side = this.getSide(key);
        if (board && side == "white") {
            board.whitePlayer = false;
            board.whiteWS = null;
        } else if (board && side == "black" ){
            board.blackPlayer = false;
            board.blackWS = null;
        }
    }

    isAvailable(key) {
        let board = this.getBoard(key);
        let side = this.getSide(key);
        if (board && side && side == "white") {
            return !board.whitePlayer;
        } else if (board && side && side == "black" ) {
            return !board.blackPlayer;
        }
        return false;
    }

    move(key, x0, y0, x1, y1) {
        let board = this.getBoard(key);
        if (board && board.coords[x0]) {
            let piece = board.coords[x0][y0];
            if (piece && piece.getMoves().some(v => v[0] == x1 && v[1] == y1) && board.turn == this.getSide(key)) {
                board.movePiece(board.coords[x0][y0], x1, y1);
                this.sendOther(key, "LASTMOVE", [x0, y0, x1, y1]);
            }
        }
    }

    sendTo(key, ins, v) {
        let board = this.getBoard(key);
        if (!board) {
            return;
        }
        let side = this.getSide(key);
        if (!side) {
            return;
        }
        if (board.whiteWS && side == "white") {
            board.whiteWS.send(JSON.stringify({
                ins,
                v
            }));
        }
        if (board.blackWS && side == "black") {
            board.blackWS.send(JSON.stringify({
                ins,
                v
            }));
        }
    }

    sendOther(key, ins, v) {
        key = this.getOtherKey(key);
        if (!key) {
            return;
        }
        this.sendTo(key, ins, v);
    }

    sendAll(key, ins, v) {
        this.sendTo(key, ins, v);
        this.sendOther(key, ins, v);
    }
}

module.exports = BoardManager;