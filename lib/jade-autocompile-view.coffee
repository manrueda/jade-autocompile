{View} = require 'atom-space-pen-views'
module.exports =
class IconVew extends View
  @content: ->
    @div class: 'jade-autocompile-status inline-block', =>
      @span outlet: 'statusContainer', =>
      @span click: 'newTermClick', class: "jade-autocompile icon icon-plus"

  activeIndex: 0
  initialize: (serializeState) ->
    @attach()

  attach: (statusBar) ->
    statusBar = document.querySelector("status-bar")
    if statusBar?
      @statusBarTile = statusBar.addLeftTile(item: this, priority: 100)

  # Returns an object that can be retrieved when package is activated
  # serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()
