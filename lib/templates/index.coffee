define ["app", "./controller"], (App, Controller) ->
  App.module "$_uname", ($_uname, App, Backbone, Marionette, $, _)->
    API =
      show$_uname: ->
        Controller.show$_uname()

    $_uname.on "start", ->
      API.show$_uname()

  App.$_uname