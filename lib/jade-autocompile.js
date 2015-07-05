(function () {
  var CompositeDisposable = require('atom').CompositeDisposable;
  var IconVew = require ('./jade-autocompile-view.js');
  var fs       = require ('fs');
  var path     = require ('path');
  var loophole = require('loophole');
  var merge = require('merge');

  function parseJS(js){
    return new Function('return ' + js + ';')();
  }

  function allowUnsafe(cb) {
    return loophole.allowUnsafeNewFunction(function () {
      return loophole.allowUnsafeEval(cb);
    });
  }

  //extract the options of the file
  function getOptions(file, options) {
    var extracted = /\/\/(.|\n[ \t])*/.exec(file);
    var params = extracted ? extracted[0].substring(2) : undefined;
    if (params){
      var opts = params.split(',');
      for (var i = 0; i < opts.length; i++) {
        var name = opts[i].split(':')[0].trim();
        var value = opts[i].split(':')[1].trim();

        options[name] = value;
        if (name == 'self' || name == 'debug' || name == 'compileDebug' || name == 'cache' || name == 'pretty'){
          options[name] = (value.toLowerCase() == 'true');
        }
        if (name == 'globals'){
          options[name] = allowUnsafe(function () {
            return parseJS(value);
          });
        }
      }
      console.log('options :%o', options);
      file = file.substring(extracted[0].length).trimLeft();
    }
    return file;
  }
  //extract the locals of the file
  function getLocals(file, options) {
    var extracted = /\/\/(.|\n[ \t])*/.exec(file);
    var params = extracted ? extracted[0].substring(2) : undefined;
    if (params){
      try {
        options = allowUnsafe(function () {
          console.log('locals :%o', parseJS(params));
          return merge(options, parseJS(params));
        });
      } catch (e) {
        console.warn(e);
      }
      file = file.substring(extracted[0].length).trimLeft();
    }
    return file;
  }

  module.exports = {
    activate: function activate(state) {
      var that = this;
      that.state = state;
      //atach the events
      atom.workspace.onDidChangeActivePaneItem(function(){
        that.toggle();
      });
      return atom.packages.onDidActivateInitialPackages(function(){
        that.toggle();
      });
    },
    deactivate: function deactivate() {
      if (this.icon){
        this.destroy();
      }
    },
    handleSave: function handleSave() {
      var that = this;
      that.activeEditor = atom.workspace.getActiveTextEditor();
      if (that.activeEditor){
        that.filePath = that.activeEditor.getURI();
        that.fileExt = path.extname(that.filePath);
        if (that.fileExt == '.jade')
          that.compile();
        }
    },
    compile: function compile() {
      var that = this;
      if (that.icon)
        that.icon.setNoCompiled();



      var file = that.filePath;
      fs.readFile(file, {encoding: 'utf-8'}, function readFile(err, data) {
        var options = {};
        var data = getOptions(data, options);
        if (!options.output)
          return;
        data = getLocals(data, options);
        options.pretty = options.pretty != undefined ? options.pretty : true;

        var jade = allowUnsafe(function(){
          return require('jade');
        });

        that.jadeCode = loophole.allowUnsafeNewFunction(function () {
          return loophole.allowUnsafeEval(function () {
            return jade.render(data, options);
          });
        });
        that.saveJade(options.output, function cb() {
          if (that.icon)
            that.icon.setCompiled();
        });
      });
    },
    saveJade: function saveJade(name, cb) {
      var that = this;
      var _url = path.join(path.dirname(that.filePath), name);

      fs.writeFile(_url, that.jadeCode, function writeFile(err){
        if (err){
          atom.notifications.addError(err,{dismissable: true});
        }else{
          cb()
        }
      });
    },
    toggle: function toggle(state) {
      var that = this;
      that.activeEditor = atom.workspace.getActiveTextEditor()
      if (that.icon)
        that.icon.destroy();
      if (that.activeEditor){
        that.activeEditor.onDidSave(function(){
          that.handleSave();
        });
        var filePath = that.activeEditor.getURI();
        var fileExt = path.extname(filePath);
        if (fileExt == '.jade'){
          that.icon = new IconVew(that.state.cliStatusViewState);
        }
      }
    }
  }
})();
