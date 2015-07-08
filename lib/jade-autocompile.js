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
    var extracted = /^\/\/(.|\n[ \t])*/.exec(file);
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

      console.log('options :%o', options);
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

    handleSave: function handleSave() {
      var _this = this;
      _this.activeEditor = atom.workspace.getActiveTextEditor();
      if (_this.activeEditor) {
        _this.filePath = _this.activeEditor.getURI();
        _this.fileExt = path.extname(_this.filePath);
        if (_this.fileExt == '.jade')
          _this.compile();
      }
    },

    compile: function compile(cb) {
      var _this = this;
      if (_this.icon)
        _this.icon.setNoCompiled();

      var file = _this.filePath;
      fs.readFile(file, {encoding: 'utf-8'}, function readFile(err, data) {
        var options = {};
        data = getOptions(data, options);
        if (!options.output)
          return;
        data = getLocals(data, options);
        options.pretty = options.pretty !== undefined ? options.pretty : true;

        var jade = allowUnsafe(function() {
          return require('jade');
        });

        _this.jadeCode = loophole.allowUnsafeNewFunction(function() {
          return loophole.allowUnsafeEval(function() {
            return jade.render(data, options);
          });
        });

        _this.saveJade(options.output, function onSave() {
          if (_this.icon)
            _this.icon.setCompiled();
          cb();
        });
      });
    },

    saveJade: function saveJade(name, cb) {
      var _this = this;
      var _url = path.join(path.dirname(_this.filePath), name);

      fs.writeFile(_url, _this.jadeCode, function writeFile(err) {
        if (err) {
          atom.notifications.addError(err, {dismissable: true});
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
        _this.activeEditor.onDidSave(function() {
          _this.handleSave();
        });

        var filePath = _this.activeEditor.getURI();
        var fileExt = path.extname(filePath);
        if (fileExt == '.jade') {
          _this.icon = new IconVew(_this.state.cliStatusViewState);
        }
      }
    }
  };
})();
