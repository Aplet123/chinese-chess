function checkProper(args, cmd) {
    if (args.length <= cmd.args.slice().reverse().findIndex(v => !v.endsWith("?"))) {
        return false;
    }
    return true;
}

function formatArg(arg) {
    if (arg.endsWith("?")) {
        return ` [<${arg}>]`;
    }
    return ` <${arg}>`;
}

function formatCommand(cmd) {
    return `/${cmd.name}${cmd.args.map(v => formatArg(v)).join``}`;
}

var commands = {};
commands.help = {
    args: ["cmd?"],
    name: "help",
    desc: "Returns a list of commands or details on a single command.",
    cmd: function(cmd) {
        if (cmd) {
            if (cmd in commands) {
                cmd = commands[cmd];
                return {
                    italics: true,
                    message: `${formatCommand(cmd)}: ${cmd.desc}`
                };
            }
            return {
                italics: true,
                message: `Command not found.`
            };
        }
        return {
            italics: true,
            message: Object.values(commands).map(v => formatCommand(v)).join`, `
        };
    }
};
commands.forfeit = {
    args: [],
    name: "forfeit",
    desc: "Forfeit the game.",
    cmd: function() {
        this.sendInstruction("FORFEIT");
        return null;
    }
};
commands.draw = {
    args: [],
    name: "draw",
    desc: "Offer a draw.",
    cmd: function() {
        this.sendInstruction("DRAW");
        return {
            italics: true,
            message: "Offer sent."
        };
    }
};