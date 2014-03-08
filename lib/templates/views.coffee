define ["marionette", "text!./tpl/$_name-tpl.html"], (Marionette, $_lnameTpl) ->
  $_unameView: class $_unameView extends Marionette.ItemView
    template: _.template $_lnameTpl