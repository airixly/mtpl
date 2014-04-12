var fs = require('fs'), path = require('path'), ncp = require('ncp'),
    options = require('./helper').parse(process.argv.slice(2)), API;

API = function (root) {
    this.root = root;
    this.name = this.getModuleName();
    this.moduleName = this.toTitleCase(this.name);
};

API.prototype = {
    /**
     * Get Module name from input
     * @returns {XML|string|void}
     */
    getModuleName: function () {
        var names = this.root.split(path.sep), name = names[names.length - 1];
        return name.replace(/\./g, "-");
    },
    /**
     * Change string like 'base-item-view' to 'baseItemView'
     * @param str {string}
     * @returns {XML|string|void}
     */
    toTitleCase: function (str) {
        return str.replace(/-(\w)/g, function (match, p1) {
            return p1.toUpperCase();
        });
    },
    /**
     * Capitalize string
     * @param str   {string}
     * @param upper {boolean}
     * @returns {string}
     */
    capitalize: function (str, upper) {
        var method = 'to' + (upper ? "Upper" : "Lower") + 'Case';
        return str.charAt(0)[method]() + str.slice(1);
    },
    /**
     * Replace the template string with specified name
     * @param str
     * @returns {XML|string|void}
     */
    replaceTemplate: function (str) {
        var self = this;
        return str.replace(/\$([lu]?)name/g, function (match, p1) {
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
    },

    log: function (type, message) {
        console.log('Create ' + type + ' ---> ' + message);
    },

    init: function () {
        this.createRoot();
    },
    /**
     * Create root directory
     */
    createRoot: function () {
        var self = this;
        fs.stat(this.root, function (err, stats) {
            if (err === null && stats.isDirectory()) {
                console.log(self.root);
                console.warn('The directory already exists!');
                return;
            } else if (err.code === 'ENOENT') {
                self.createModules();
            } else {
                throw err;
            }
        });
    },
    /**
     * Create module by type
     */
    createModules: function () {
        var self = this;
        fs.mkdir(this.root, function () {
            switch (options.type) {
                case "app":
                    self.createAppModule();
                    break;
                case "j":
                    self.createJSModule();
                    break;
                case "m":
                    self.createMarionetteModule();
                    break;
            }
        });
    },
    /**
     * App module
     * Copy static resources to root directory,then create temp files
     */
    createAppModule: function () {
        var appPath = path.resolve(__dirname, './tpl/app/'), self = this;
        this.log('App', options.name);
        ncp(path.join(appPath, 'static'), this.root, function (err) {
            if (err) {
                fs.rmdir(self.root);
                return console.error(err);
            }
            self.createTempFiles(options.type, path.join(appPath, 'temp'), self.root);
        });
    },
    /**
     *  JavaScript module
     */
    createJSModule: function () {
        var content = this.replaceTemplate('define(["text!./assets/tpl/$name-tpl.html"], function ($lnameTpl) {});')
        this.log('JS module', options.name);
        fs.writeFile(this.root + '/index.js', content);
        this.createAssetsDir(path.resolve(this.root, 'assets'));
    },
    /**
     * Marionette module with CoffeeScript
     */
    createMarionetteModule: function () {
        this.log('Marionette', options.name);
        this.createAssetsDir(path.resolve(this.root, 'assets'));
        this.createTempFiles(options.type, path.resolve(__dirname, './tpl/module/m/'), this.root);
    },
    /**
     * Create assets directory structure
     * @param assetsPath
     */
    createAssetsDir: function (assetsPath) {
        var self = this;
        fs.mkdir(assetsPath, function () {
            var fileName = self.name + '.scss';
            fs.writeFile(assetsPath + '/' + fileName, '');
            self.log('file', fileName);
            fs.mkdir((assetsPath + '/tpl'), function () {
                var tplName = self.name + '-tpl.html';
                fs.writeFile(assetsPath + '/tpl/' + tplName, '');
                self.log('file', tplName);
            });
        });
    },
    /**
     * Create temp files
     * @param type
     * @param src
     * @param dest
     */
    createTempFiles: function (type, src, dest) {
        var self = this;
        this.getTemps(type).forEach(function (temp) {
            self.createFile(src, dest, temp);
        });
    },
    /**
     * Return temps data by type
     * @param type
     * @returns {Array}
     */
    getTemps: function (type) {
        var temps = [];
        switch (type) {
            case 'app':
                temps = ['bower.json', 'package.json'];
                break;
            case 'm':
                temps = ['controller.coffee', 'index.coffee', 'views.coffee'];
                break;
        }
        return temps;
    },
    /**
     * Create temp file,replace
     * @param src
     * @param dest
     * @param name
     */
    createFile: function (src, dest, name) {
        var self = this, filePath = path.resolve(src, name);
        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
            if (err) {
                throw err;
            }
            data = self.replaceTemplate(data);
            fs.writeFile(path.resolve(dest, name), data, function (err) {
                if (err) {
                    throw err
                }
                self.log('file', name);
            });
        });
    }
};

/**
 * Export API
 */
exports.run = function () {
    var api;
    if (!options.continueProcessing) {
        return;
    }
    api = new API(path.resolve(process.cwd(), options.name));
    api.init();
};