#!/usr/bin/env node
var path = require("path"), mtpl = require("../lib/mtpl"), args = process.argv;
if (args.length < 3) {
    console.error("[ERROR] module's name is missing!");
    return;
}
mtpl(path.resolve(process.cwd(), args[2]));