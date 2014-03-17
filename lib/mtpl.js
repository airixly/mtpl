var fs = require('fs'), path = require('path'),
    options = require("./helper").parse(process.argv.slice(2)), API;

API = function (root) {
    this.root = root;
    this.tpls = this.getTemplates();
    this.name = this.getModuleName();
    this.moduleName = this.toTitleCase(this.name);
};

API.prototype.init = function () {
    var self = this;
    fs.stat(this.root, function (err, stats) {
        if (err === null && stats.isDirectory()) {
            console.log(self.root);
            console.warn('The directory already exists!');
            console.log('You can use -f or --force to overwrite existing directory!');
            return;
        } else if (err.code === 'ENOENT') {
            self.createDir();
        } else {
            throw err;
        }
    });
};

API.prototype.getModuleName = function () {
    var names = this.root.split(path.sep), name = names[names.length - 1];
    return name.replace(/\./g, "-");
};

API.prototype.toTitleCase = function (str) {
    return str.replace(/-(\w)/g, function (match, p1) {
        return p1.toUpperCase();
    });
};

API.prototype.createDir = function () {
    var self = this;
    fs.mkdir(this.root, function () {
        self.tpls.forEach(function (tpl) {
            var isDir = true;
            switch (tpl.type) {
                case "f":
                    isDir = false;
                case "d":
                    self.createDirTpl(tpl, isDir);
                    break;
                default :
                    return;
            }
        });
    });
};

API.prototype.createTpl = function (prefix, tpl, content) {
    var fileName = this.getFileName(prefix, tpl);
    fs.writeFile(fileName, content, function (err) {
        if (err) {
            throw err
        }
        console.log('Create file ---> ' + fileName);
    });
};

API.prototype.createDirTpl = function (tpl, isDir) {
    var self = this, dirPath = this.root, content = '';
    if (tpl.name && tpl.suffix) {
        if (isDir) {
            dirPath = path.join(dirPath, tpl.name);
            fs.mkdir(dirPath, function () {
                self.createTpl(dirPath + '/' + self.name, tpl, content);
            });
        } else {
            content = this.createFileTpl(tpl);
        }
    }
};

API.prototype.createFileTpl = function (tpl) {
    var self = this, filePath = path.resolve(__dirname, './templates') + '/' + tpl.name;
    fs.readFile(this.getFileName(filePath, tpl), {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            throw err;
        }
        data = data.replace(/\$_([lu]?)name/g, function (match, p1) {
            var res, upper = false;
            switch (p1) {
                case 'u':
                    upper = true;
                case 'l':
                    res = self.capitalize(self.moduleName, upper);
                    break;
                default:
                    res = self.name
            }
            return res;
        });
        self.createTpl(self.root + '/' + tpl.name, tpl, data);
    });
};

API.prototype.capitalize = function (str, upper) {
    var method = 'to' + (upper ? "Upper" : "Lower") + 'Case';
    return str.charAt(0)[method]() + str.slice(1);
};

API.prototype.getFileName = function (name, tpl) {
    if (tpl.desc) {
        name += "-" + tpl.desc;
    }
    if (tpl.suffix) {
        name += "." + tpl.suffix;
    }
    return name;
};

API.prototype.getTemplates = function () {
    return [
        {
            name: "assets",
            suffix: "less",
            desc: "",
            type: "d"
        },
        {
            name: "tpl",
            suffix: "html",
            desc: "tpl",
            type: "d"
        },
        {
            name: "index",
            suffix: "coffee",
            desc: "",
            type: "f"
        },
        {
            name: "controller",
            suffix: "coffee",
            desc: "",
            type: "f"
        },
        {
            name: "views",
            suffix: "coffee",
            desc: "",
            type: "f"
        }
    ];
};

exports.run = function () {
    var api;
    if (!options.continueProcessing) {
        return;
    }
    api = new API(path.resolve(process.cwd(), options.name));
    api.init();
};