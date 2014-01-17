define ["app", "./views"], (App, Views) ->
  show$_name: ->
    $_lnameView = @get$_nameView()

  get$_nameView: ->
    new Views.$_nameView