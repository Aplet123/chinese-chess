function leavePage () {
    window.onbeforeunload = undefined;
    location.href = "/";
}

function escapeHTML (str) {
    if (!str) {
        str = "";
    }
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&#34;");
}

function getName (side) {
    return {
        white: "red",
        black: "black",
        spec: "a spectator"
    }[side];
}

function getNameCaps (side) {
    return getName(side).replace(/^\w/, m => m.toUpperCase());
}