console.profile('Startup Time jade-compiler');
var CompositeDisposable = require('atom').CompositeDisposable;
var IconVew = require ('./jade-autocompile-view.js');
var fs       = require ('fs');
var path     = require ('path');

function parseJS(js){
  return new Function('return ' + js + ';')();
}

module.exports = {
  activate: function activate(state) {
    var that = this;
    that.state = state;
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
        return that.compile();
      }
  },
  compile: function compile() {
    var that = this;
    if (that.icon)
      that.icon.setNoCompiled();

    var loophole = require('loophole');
    var jade = loophole.allowUnsafeNewFunction(function () {
      return loophole.allowUnsafeEval(function () {
        return require('jade');
      });
    });

    var file = that.filePath;
    fs.readFile(file, {encoding: 'utf-8'}, function readFile(err, data) {
      var params = /\/\/(.|\n[ \t])*/.exec(data);
      params = params || [];
      if (params.length > 0){
        if(params[0].substring(0, 11) !== '//compiler:'){
          return;
        }
        var name = params[0].trim().substring(11);
        data = data.substring(params.reduce(function(a, b){return a.length + b.length;}));
        var params = /\/\/(.|\n[ \t])*/.exec(data);
        params = params || [];
        if (params.length > 0){
          try {
            params = loophole.allowUnsafeNewFunction(function () {
              return parseJS(params[0].substring(2));
            });
          } catch (e) {
            params = {};
          }
        }else{
          params = {};
        }

        params.pretty = true;
        that.jadeCode = loophole.allowUnsafeNewFunction(function () {
          return loophole.allowUnsafeEval(function () {
            return jade.render(data, params);
          });
        });
        that.saveJade(name, function cb() {
          if (that.icon)
            that.icon.setCompiled();
        })
      }
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
    if (that.activeEditor){
      that.activeEditor.onDidSave(function(){
        that.handleSave();
      });
      var filePath = that.activeEditor.getURI();
      var fileExt = path.extname(filePath);
      if (fileExt == '.jade'){
        that.icon = new IconVew(that.state.cliStatusViewState);
      }else{
        if (that.icon)
          that.icon.destroy();
      }
    }
  }
}
console.profileEnd('Startup Time jade-compiler')
