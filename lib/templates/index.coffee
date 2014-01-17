define ["app", "./controller"], (App, Controller) ->
  App.module "$_name", ($_name, App, Backbone, Marionette, $, _)->
    API =
      show$_name: ->
        Controller.show$_name()

    $_name.on "start", ->
      API.show$_name()

  App.$_name