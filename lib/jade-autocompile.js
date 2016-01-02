(function() {
  var CompositeDisposable = require('atom').CompositeDisposable;
  var IconVew = require ('./jade-autocompile-view.js');
  var fs       = require ('fs');
  var path     = require ('path');
  var loophole = require('loophole');
  var merge = require('merge');

  function parseJS(js) {
    return new Function('return ' + js + ';')();
  }

  function allowUnsafe(cb) {
    return loophole.allowUnsafeNewFunction(function() {
      return loophole.allowUnsafeEval(cb);
    });
  }

  //extract the options of the file
  function getOptions(file, options) {
    var extracted = /^\/\/(?!-)(.|\n[ \t])*/.exec(file);
    var params = extracted ? extracted[0].substring(2) : undefined;
    if (params) {
      var opts = params.split(',');
      for (var i = 0; i < opts.length; i++) {
        var name = opts[i].split(':')[0].trim();
        var value = opts[i].split(':')[1].trim();

        options[name] = value;
        if (name == 'self' || name == 'debug' || name == 'compileDebug' || name == 'cache' || name == 'pretty') {
          options[name] = (value.toLowerCase() == 'true');
        }

        if (name == 'globals') {
          options[name] = allowUnsafe(function() {
            return parseJS(value);
          });
        }
      }

      file = file.substring(extracted[0].length).trimLeft();
    }

    return file;

  }

  //extract the locals of the file
  function getLocals(file, options) {
    var extracted = /^\/\/(.|\n[ \t])*/.exec(file);
    var params = extracted ? extracted[0].substring(2) : undefined;
    if (params) {
      try {
        options = allowUnsafe(function() {
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

      var _this = this;
      _this.state = state;

      //atach the events
      atom.workspace.onDidChangeActivePaneItem(function() {
        _this.toggle();
      });

      return atom.packages.onDidActivateInitialPackages(function() {
        _this.toggle();
      });
    },

    deactivate: function deactivate() {
      if (this.icon) {
        this.destroy();
      }
    },

    handleSave: function handleSave(editor) {
      var _this = this;
      if (editor) {
        _this.filePath = editor.getURI();
        _this.fileExt = path.extname(_this.filePath);
        if (_this.fileExt == '.jade'){

          var _this = this;
          if (_this.icon){
            _this.icon.setNoCompiled();
            if (_this.activeEditor)
              _this.activeEditor.jade_compiled = false;
          }

          _this.compile(editor.getURI()).then(function (err, _jade, options) {
            if (err){
              var discomposed = err.message.split('\n');
              atom.notifications.addWarning(discomposed[0] + '\n' + discomposed[discomposed.length - 1], {dismissable: true, detail: discomposed.slice(1, discomposed.length - 2).join('\n')});
              if (_this.activeEditor)
                _this.activeEditor.jade_compiled = false;
              if (_this.icon)
                _this.icon.setNoCompiled();
              return;
            }
            _this.saveJade(editor.getURI(), _jade, options.output, function() {

              if (_this.activeEditor)
                _this.activeEditor.jade_compiled = true;

              if (_this.icon)
                _this.icon.setCompiled();
            });

          });
        }
      }
    },
    compile: function compile(file, cb) {
      var _this = this;
      var fn;

      fs.readFile(file, {encoding: 'utf-8'}, function readFile(err, data) {
        var options = {};

        //Fix a new line an carret return error in windows.
        data = data.split('\r\n').join('\n');

        data = getOptions(data, options);
        if (!options.output)
          return;
        data = getLocals(data, options);
        options.pretty = options.pretty !== undefined ? options.pretty : true;

        //Add the filename property to allow the import of others .jade
        options.filename = file;

        var jade = allowUnsafe(function() {
          return require('jade');
        });

        _this.jadeCode = undefined;

        _this.jadeCode = loophole.allowUnsafeNewFunction(function() {
          return loophole.allowUnsafeEval(function() {

            try {
              return jade.render(data, options);
            } catch (err) {
              if (fn)
                fn(err);
              if (cb)
                cb(err);
            }

          });
        });
        if (_this.jadeCode && fn){
          fn(undefined, _this.jadeCode, options);
        }
        if (_this.jadeCode && cb)
          cb(undefined, _this.jadeCode, options);
      });

      return {
        then: (_fn) =>{
          fn = _fn;
        }
      };
    },

    saveJade: function saveJade(filePath, _jade, name, cb) {
      var _this = this;

      var originalExt = path.extname(filePath).substring(1);
      var originalName = path.basename(filePath, originalExt);
      originalName = originalName.substring(0, originalName.length - 1);
      var originalPath = path.dirname(filePath)
      var commentName = name.replace('$1', originalName).replace('$2', originalExt);
      var result = path.resolve(originalPath, commentName);

      fs.writeFile(result, _jade, function writeFile(err) {
        if (err) {
          if (err.errno && err.errno === 'ENOENT'){
            atom.notifications.addError(err.message, {dismissable: true});
          }
        } else {
          cb();
        }
      });
    },

    toggle: function toggle(state) {
      var _this = this;
      _this.activeEditor = atom.workspace.getActiveTextEditor();
      if (_this.icon)
        _this.icon.destroy();
      if (_this.activeEditor) {

        var filePath = _this.activeEditor.getURI();
        var fileExt = path.extname(filePath);
        if (fileExt == '.jade') {
          if (_this.activeEditor.jade_loaded !== true){

            _this.activeEditor.onDidSave((function(editor){
              return function(){
                _this.handleSave(editor);
              }
            })(_this.activeEditor));

            _this.activeEditor.onDidChange(function() {
              if (_this.activeEditor)
                _this.activeEditor.jade_compiled = false;
              _this.icon.setNoCompiled();
            });
            _this.activeEditor.jade_loaded = true;
          }

          _this.icon = new IconVew(_this.state.cliStatusViewState);

          if (_this.activeEditor.jade_compiled){
            _this.icon.setCompiled();
          }
        }
      }
    }
  };
})();
