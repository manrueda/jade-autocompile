{CompositeDisposable} = require 'atom'
IconVew = require './jade-autocompile-view.coffee'
fs       = require 'fs'
path     = require 'path'
readline = require 'readline'

parseJS = (js) ->
  new Function('return ' + js + ';')()
module.exports = JadeAutocompile =
  activate: (state) ->
    @state = state
    atom.workspace.onDidChangeActivePaneItem => @toggle()
    atom.packages.onDidActivateInitialPackages => @toggle()
  deactivate: ->
    if @icon
      @icon.destroy()
  serialize: -> # ...
  handleSave: () ->
    @activeEditor = atom.workspace.getActiveTextEditor()
    if @activeEditor
      @filePath = @activeEditor.getURI()
      @fileExt = path.extname @filePath
      if @fileExt == '.jade'
        return @compile()
  compile: ->
    if @icon
      @icon.setNoCompiled()
    {allowUnsafeEval, allowUnsafeNewFunction} = require 'loophole'
    jade = allowUnsafeNewFunction -> allowUnsafeEval -> require 'jade'
    file = @filePath
    fs.readFile file, {encoding: 'utf-8'}, (err, data) =>
      params = /\/\/(.|\n[ \t])*/.exec data
      params = params || []
      if params.length > 0
        data = data.substring(params[0].length);
        params = allowUnsafeNewFunction -> parseJS params[0].substring(2)
      else
        params = {}

      params.pretty = true
      @jadeCode = allowUnsafeNewFunction -> allowUnsafeEval -> jade.render data,          params
      @saveJade =>
        if @icon
          @icon.setCompiled()
  saveJade: (cb) ->
    _url = path.parse @filePath
    _url.ext = '.html'
    _url.base = _url.name + _url.ext
    _url = path.format _url
    fs.writeFile _url, @jadeCode, (err)->
      if err
        atom.notifications.addError err,
          dismissable: true
      else
        cb()
  toggle: (state) ->
    @activeEditor = atom.workspace.getActiveTextEditor()
    if @activeEditor
      @activeEditor.onDidSave => @handleSave()
      filePath = @activeEditor.getURI()
      fileExt = path.extname filePath
      if fileExt == '.jade'
        @icon = new IconVew(@state.cliStatusViewState)
      else
        if @icon
          @icon.destroy()
