require.config({
    "paths": {
        "jquery": "../vendor/jquery/dist/jquery",
        "underscore": "../vendor/underscore/underscore",
        "text": "../vendor/requirejs-text/text",
        "requireLib": "../vendor/requirejs/require"
    },
    "include": ["requireLib"]
});

require([
    "app"
], function (App) {
    App.start();
});