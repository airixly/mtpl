var mtpl = {
    VERSION: "0.0.4",
    BANNER: "Usage: mtpl [options] your-module-name",
    HELPER: [
        ["-v", "--version", "display the version number"],
        ["-h", "--help", "display the help message"]
    ]
}, repeat, printHelper;

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

exports.parse = function (args) {
    var match, options = {
        continueProcessing: true,
        name: args[0] || "-h"
    };

    if (match = options.name.match(/^--?([a-z][0-9a-z]*)/i)) {
        options.name = match[1];
        options.continueProcessing = false;
    } else {
        return options;
    }
    switch (options.name) {
        case "v":
        case "version":
            console.log("mtpl version " + mtpl.VERSION);
            break;
        case "h":
        case "help":
            printHelper();
            break;
    }
    return options;
};