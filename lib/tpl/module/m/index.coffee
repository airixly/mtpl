define ["app", "./controller"], (App, Controller) ->
  App.module "$uname", ($uname, App, Backbone, Marionette, $, _)->
    API =
      show$uname: ->
        Controller.show$uname()

    $uname.on "start", ->
      API.show$uname()

  App.$uname