var settings = {};

function updateSetting(name, value) {
    if (value != settings[name].value) {
        if (value) {
            settings[name].setFunc();
        } else {
            settings[name].resFunc();
        }
    }
    settings[name].value = value;
    localStorage.setItem(name, String(value));
}

function addSetting(name, text, resetF, setF, def) {
    if (def === undefined) {
        def = false;
    }
    settings[name] = {
        value: def,
        resFunc: resetF,
        setFunc: setF
    };
    var settingDiv = d3.select("#settings")
        .append("div")
        .classed("settings", true);
    var settingLabel = settingDiv.append("label")
        .classed("switch", true);
    var input = settingLabel.append("input")
        .attr("type", "checkbox")
        .property("checked", def)
        .on("change", function() {
            updateSetting(name, this.checked);
        });
    settingLabel.append("span")
        .classed("slider round", true);
    settingDiv.append("p")
        .text(text);
    if (localStorage.getItem(name) !== null) {
        input.property("checked", localStorage.getItem(name) == (! def).toString());
        input.dispatch("change");
    }
}

var suffix = "";
addSetting("useicons", "Use icons", function () {
    suffix = "";
}, function () {
    suffix = "_icon";
});
var blindfolded = false;
addSetting("blindfold", "Play blindfolded", function () {
    blindfolded = false;
}, function () {
    blindfolded = true;
});
addSetting("dark", "dArK mOdE", function () {
    d3.select("body").classed("dark", false);
}, function () {
    d3.select("body").classed("dark", true);
});
var anims = false;
addSetting("anims", "Animations", function () {
    anims = false;
}, function () {
    anims = true;
});