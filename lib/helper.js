/**
 * Display help information
 * @type {exports|*}
 */
var path = require("path"),
    pkg = require(path.join(__dirname, "..", "package.json")),
    mtpl = {
        VERSION: pkg.version,
        BANNER: "Usage: mtpl [options] app-name",
        HELPER: [
            ["-v", "--version", "display the version number"],
            ["-h", "--help", "display the help message"],
            ["-j", "--javascript", "create a JavaScript module"],
            ["-m", "--marionette", "create a Marionette module with CoffeeScript"]
        ]
    }, repeat, printHelper;

/**
 * Repeat a string n times
 * @type {Function}
 */
exports.repeat = repeat = function (str, n) {
    var res = str;
    while (n-- > 0) {
        res += str;
    }
    return res;
};

printHelper = function () {
    var i, len, longOption, message = "\n" + mtpl.BANNER + "\n\n";
    for (i = 0, len = mtpl.HELPER.length; i < len; i++) {
        longOption = mtpl.HELPER[i][1];
        message += repeat(" ", 2) + mtpl.HELPER[i][0] + ", " + longOption +
            repeat(" ", 15 - longOption.length) + mtpl.HELPER[i][2] + "\n";
    }
    console.log(message);
};

/**
 * Parse Input params,then set options for next step
 * @param args
 * @returns {{continueProcessing: boolean, name: (*|string)}}
 */
exports.parse = function (args) {
    var matches, options = {
        continueProcessing: true,
        name: args[0] || "-h",
        type: "app"
    }, regex = /^--?([a-z][0-9a-z]*)/i;

    if (matches = regex.exec(options.name)) {
        options.type = matches[1];
        options.name = args[1];
    } else {
        return options;
    }
    switch (options.type) {
        case "v":
        case "version":
            options.continueProcessing = false;
            console.log("mtpl version " + mtpl.VERSION);
            break;
        case "h":
        case "help":
            options.continueProcessing = false;
            printHelper();
            break;
    }
    return options;
};