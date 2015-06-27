{View} = require 'atom-space-pen-views'
module.exports =
class IconVew extends View
  @content: ->
    @div class: 'jade-autocompile-status inline-block', =>
      @span outlet: 'statusContainer', =>
      @span "Compiled", class: "jade-autocompile icon icon-x"

  activeIndex: 0
  initialize: (serializeState) ->
    @attach()

  attach: (statusBar) ->
    statusBar = document.querySelector("status-bar")
    if statusBar?
      @statusBarTile = statusBar.addLeftTile(item: this, priority: 200)
  setCompiled: ->
    icon = document.querySelector(".jade-autocompile-status .icon")
    icon.classList.remove('icon-x')
    icon.classList.add('icon-check')
    icon.textContent = "Compiled"
  setNoCompiled: ->
    icon = document.querySelector(".jade-autocompile-status .icon")
    icon.classList.add('icon-x')
    icon.classList.remove('icon-check')
    icon.textContent = "No compiled"
  # Returns an object that can be retrieved when package is activated
  # serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()
