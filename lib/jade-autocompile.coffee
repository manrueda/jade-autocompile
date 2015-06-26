{CompositeDisposable} = require 'atom'
IconVew = require './jade-autocompile-view.coffee'
fs       = require 'fs'
path     = require 'path'


module.exports = JadeAutocompile =
  activate: (state) ->
    atom.commands.add 'atom-workspace', 'core:save': => @handleSave()
    @icon = new IconVew(state.cliStatusViewState)
  deactivate: ->
    @icon.destroy()
  serialize: -> # ...
  handleSave: ->
    @activeEditor = atom.workspace.getActiveTextEditor()
    if @activeEditor
      @filePath = @activeEditor.getURI()
      @fileExt = path.extname @filePath
      if @fileExt == '.jade'
        return @compile()
  compile: ->
    {allowUnsafeEval, allowUnsafeNewFunction} = require 'loophole'
    jade = allowUnsafeNewFunction -> allowUnsafeEval -> require 'jade'
    file = @filePath
    @jadeCode = allowUnsafeNewFunction -> allowUnsafeEval -> jade.renderFile file
    @saveJade()
  saveJade: ->
    _url = path.parse @filePath
    _url.ext = '.html'
    _url.base = _url.name + _url.ext
    _url = path.format _url
    fs.writeFile _url, @jadeCode, (err)->
      if err
        atom.notifications.addError err,
          dismissable: true
