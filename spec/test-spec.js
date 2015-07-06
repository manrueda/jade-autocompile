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

});
