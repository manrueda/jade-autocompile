var path = require('path');
var fs = require('fs');

describe('jade-autocompile module', function() {
  var compiler;
  beforeEach(function() {
    compiler = require('../lib/jade-autocompile.js');
  });

  it('compile a simple JADE with out locals or properties', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test1.jade', 'jade/test1.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('\n<html></html>');
        flag = true;
      });
    });

    waitsFor(function() {
      return flag;
    });

  });

  it('compile a simple JADE with out locals', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test2.jade', 'jade/test2.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<html><div><img/></div></html>');
        flag = true;
      });

    });

    waitsFor(function() {
      return flag;
    });

  });

  it('compile a simple JADE with locals in one line', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test3.jade', 'jade/test3.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<html><div><label>Holaaaa</label></div></html>');
        flag = true;
      });

    });

    waitsFor(function() {
      return flag;
    });

  });

  it('compile a simple JADE with locals in more than one line', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test4.jade', 'jade/test4.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<html><div><label>Holaaaa</label></div><label>33.5</label></html>');
        flag = true;
      });

    });

    waitsFor(function() {
      return flag;
    });

  });

  it('compile a more complex JADE with locals and functions', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test5.jade', 'jade/test5.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<html><div><label>Holaaaa</label></div><label>33.5</label><div><span>9</span></div></html>');
        flag = true;
      });

    });

    waitsFor(function() {
      return flag;
    });

  });

  it('compile a more complex JADE with locals, functions, arrays, objects and HTML comments', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test6.jade', 'jade/test6.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<html><div><label>Holaaaa</label></div><label>33.5</label><div><span>9</span><!--this comment must not \'joder\'--></div><section><span>44,Chauuu</span><span>99</span></section></html>');
        flag = true;
      });

    });

    waitsFor(function() {
      return flag;
    });

  });

  it('compile the previous test but pretty', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test6.pretty.jade', 'jade/test6.pretty.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('\n<html>\n  <div>\n    <label>Holaaaa</label>\n  </div>\n  <label>33.5</label>\n  <div><span>9</span>\n    <!--this comment must not \'joder\'-->\n  </div>\n  <section><span>44,Chauuu</span><span>99</span></section>\n</html>');
        flag = true;
      });

    });

    waitsFor(function() {
      return flag;
    });

  });

  it('compile a simple JADE but with some JS inside', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test7.jade', 'jade/test7.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<html><head><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.18/require.js"></script><script type="text/javascript" src="js/multi-loader.js"></script><script type="text/javascript">//call the loader with the JSON path and the root to create the URLs // return a promise\nloadModules(\'main\', \'/\').then(function(modules){\n  //log all the modules to load\n  console.log(modules);\n}).catch(function(err){\n  //catch the errors\n  console.warn(err);\n});</script></head><body></body></html>');
        flag = true;
      });

    });

    waitsFor(function() {
      return flag;
    });

  });


  it('compile a simple JADE but with one inserted jade', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test8.jade', 'jade/test8.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('\n<html>\n  <head></head>\n  <body>\n    <div><a>This is a partial!<span>true</span></a></div><span>Manuel</span>\n  </body>\n</html>');
        flag = true;
      });
    });
    waitsFor(function() {
      return flag;
    });
  });

  it('compile a simple JADE but with one inserted jade using name variables', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/test9.jade', 'jade/test9.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('\n<html>\n  <head></head>\n  <body>\n    <div><a>This is a partial!<span>true</span></a></div><span>Manuel</span>\n  </body>\n</html>');
        flag = true;
      });
    });
    waitsFor(function() {
      return flag;
    });
  });

  it('compile a simple JADE to test Attributes', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/features/attributes.jade', 'jade/features/attributes.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<!DOCTYPE html>\n<html>\n  <head></head>\n  <body><a href="google.com" class="button">Google</a><span class="authed"></span>\n    <input type="checkbox" checked><a style="color:red;background:green"></a>\n    <input type="checkbox" name="agreement" checked data-foo="bar"><a id="classes" class="foo bar baz"></a>\n  </body>\n</html>');
        flag = true;
      });
    });
    waitsFor(function() {
      return flag;
    });
  });

  it('compile a simple JADE to test Code', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/features/code.jade', 'jade/features/code.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<!DOCTYPE html>\n<html>\n  <head></head>\n  <body>\n    <p>you have 10 friends</p>\n    <ul>\n      <li>Uno</li>\n      <li>Dos</li>\n      <li>Tres</li>\n      <li>Cuatro</li>\n      <li>Cinco</li>\n      <li>Seis</li>\n    </ul><span>true10</span>\n    <h2>Authenticated</h2>\n  </body>\n</html>');
        flag = true;
      });
    });
    waitsFor(function() {
      return flag;
    });
  });


  it('compile a simple JADE to test Comments', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/features/comments.jade', 'jade/features/comments.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<!DOCTYPE html>\n<html>\n  <head></head>\n  <body>\n    <!-- HTML comments-->\n    <!--HTML block comment\n    -->\n  </body>\n</html>');
        flag = true;
      });
    });
    waitsFor(function() {
      return flag;
    });
  });

  it('compile a simple JADE to test Extends', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/features/extends.jade', 'jade/features/extends.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<!DOCTYPE html>\n<html>\n  <head></head>\n  <body>\n    <div>This is a block</div>\n  </body>\n</html>');
        flag = true;
      });
    });
    waitsFor(function() {
      return flag;
    });
  });

  it('compile a simple JADE to test Interpolation', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/features/interpolation.jade', 'jade/features/interpolation.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<!DOCTYPE html>\n<html>\n  <head></head>\n  <body>\n    <p>This user is authenticated</p>\n  </body>\n</html>');
        flag = true;
      });
    });
    waitsFor(function() {
      return flag;
    });
  });

  it('compile a simple JADE to test Mixin', function(done) {
    var flag;
    runs(function() {
      compileJade.call(this, compiler, 'jade/features/mixin.jade', 'jade/features/mixin.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('<!DOCTYPE html>\n<html>\n  <head></head>\n  <body>\n        <ul>\n              <li>1</li>\n              <li>2</li>\n              <li>3</li>\n              <li>4</li>\n              <li>5</li>\n              <li>6</li>\n        </ul>\n  </body>\n</html>');
        flag = true;
      });
    });
    waitsFor(function() {
      return flag;
    });
  });

});

function compileJade(compiler, file, output, cb) {
  compiler.filePath = path.join(__dirname, file);
  compiler.fileExt = '.jade';
  compiler.compile(path.join(__dirname, file), function(err, _jade, options) {
    if (err)
      cb(err);
    compiler.saveJade(path.join(__dirname, file), _jade, options.output, function(){
      fs.readFile(path.join(__dirname, output), {
        encoding: 'utf-8'
      }, function readFile(err, data) {
        cb(err, data);
      });
    });
  });
}
