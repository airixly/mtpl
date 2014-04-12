define ["app", "./views"], (App, Views) ->
  show$uname: ->
    $lnameView = @get$unameView()

  get$unameView: ->
    new Views.$unameView