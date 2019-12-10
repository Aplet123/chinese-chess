function leavePage () {
    window.onbeforeunload = undefined;
    location.href = "/";
}

function escapeHTML (str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
