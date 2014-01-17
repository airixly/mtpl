var fs = require('fs'), path = require('path'), API;
API = function (root) {
    this.root = root;
    this.tpls = this.getTemplates();
    this.name = this.getModuleName();
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
    var names = this.root.split(path.sep);
    return names[names.length - 1];
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
        data = data.replace(/\$_name/g, self.capitalize(self.name, true))
            .replace(/\$_lname/g, self.capitalize(self.name, false));
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
module.exports = function (root) {
    var api = new API(root);
    api.init();
}