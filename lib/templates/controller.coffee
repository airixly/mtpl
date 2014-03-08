define ["app", "./views"], (App, Views) ->
  show$_uname: ->
    $_lnameView = @get$_unameView()

  get$_unameView: ->
    new Views.$_unameView