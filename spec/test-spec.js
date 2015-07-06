var path = require('path');
var fs = require('fs');

function runTest(compiler, file, output, cb) {
  compiler.filePath = path.join(__dirname, file);
  compiler.fileExt = '.jade';
  compiler.compile(function() {
    fs.readFile(path.join(__dirname, output), {encoding: 'utf-8'}, function readFile(err, data) {
      cb(err, data);
    });
  });
}

describe('jade-autocompile module', function() {
  var compiler;
  beforeEach(function() {
    compiler = require('../lib/jade-autocompile.js');
  });

  it('compile a simple JADE with out locals or properties', function(done) {
    var flag;
    runs(function() {
      runTest.call(this, compiler, 'jade/test1.jade', 'jade/test1.html', function(err, data) {
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
      runTest.call(this, compiler, 'jade/test2.jade', 'jade/test2.html', function(err, data) {
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
      runTest.call(this, compiler, 'jade/test3.jade', 'jade/test3.html', function(err, data) {
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
      runTest.call(this, compiler, 'jade/test4.jade', 'jade/test4.html', function(err, data) {
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
      runTest.call(this, compiler, 'jade/test5.jade', 'jade/test5.html', function(err, data) {
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
      runTest.call(this, compiler, 'jade/test6.jade', 'jade/test6.html', function(err, data) {
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
      runTest.call(this, compiler, 'jade/test6.pretty.jade', 'jade/test6.pretty.html', function(err, data) {
        expect(err).toBeNull();
        expect(data).toEqual('\n<html>\n  <div>\n    <label>Holaaaa</label>\n  </div>\n  <label>33.5</label>\n  <div><span>9</span>\n    <!--this comment must not \'joder\'-->\n  </div>\n  <section><span>44,Chauuu</span><span>99</span></section>\n</html>');
        flag = true;
      });

    });

    waitsFor(function() {
      return flag;
    });

  });

});
