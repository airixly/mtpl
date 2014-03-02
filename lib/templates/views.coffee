define ["marionette", "text!./tpl/$_lname-tpl.html"], (Marionette, $_lnameTpl) ->
  $_nameView: class $_nameView extends Marionette.ItemView
    template: _.template $_lnameTpl
