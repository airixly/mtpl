define ["marionette", "text!./assets/tpl/$name-tpl.html"], (Marionette, $lnameTpl) ->
  $unameView: class $unameView extends Marionette.ItemView
    template: _.template $lnameTpl