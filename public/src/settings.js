var settings = {};

function updateSetting(name, value) {
    settings[name].value = value;
}

function addSetting(name, text) {
    var settingDiv = d3.select("#settings")
        .append("div")
        .classed("settings", true);
    var settingLabel = settingDiv.append("label")
        .classed("switch", true);
    var input = settingLabel.append("input")
        .attr("type", "checkbox")
        .on("change", function() {
            updateSetting(name, this.value == "on");
        });
    settingLabel.append("span")
        .classed("slider round", true);
    settingDiv.append("p")
        .text(text);
    settings[name] = {
        value: false
    };
}

addSetting("useicons", "Use icons");
addSetting("dark", "dArK mOdE");