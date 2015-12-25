//Inherit functions!
var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
  for (var key in parent) {
    if (__hasProp.call(parent, key))
    child[key] = parent[key];
  }

  function Ctor() {
    this.constructor = child;
  }

  Ctor.prototype = parent.prototype; child.prototype = new Ctor();
  child.__super__ = parent.prototype;
  return child;
};

var View = require('atom-space-pen-views').View;
function IconView() {
  return IconView.__super__.constructor.apply(this, arguments);
}

__extends(IconView, View);
IconView.content = function() {
  return this.div({
    class: 'jade-autocompile-status inline-block'
  }, (function(_this) {
    return function() {
      _this.span({
        outlet: 'statusContainer'
      }, function() {});

      return _this.span('Not compiled', {
        class: 'jade-autocompile icon icon-x'
      });
    };
  })(this));
};

IconView.prototype.activeIndex = 0;

IconView.prototype.initialize = function(serializeState) {
  return this.attach();
};

IconView.prototype.attach = function(statusBar) {
  statusBar = document.querySelector('status-bar');
  if (statusBar !== null) {
    this.statusBarTile = statusBar.addLeftTile({
      item: this,
      priority: 200
    });
  }
};

IconView.prototype.setCompiled = function() {
  var icon;
  icon = document.querySelector('.jade-autocompile-status .icon');
  if (icon !== undefined && icon !== null){
    icon.classList.remove('icon-x');
    icon.classList.add('icon-check');
    icon.textContent = 'Compiled';
  }
};

IconView.prototype.setNoCompiled = function() {
  var icon;
  icon = document.querySelector('.jade-autocompile-status .icon');
  if (icon !== undefined && icon !== null){
    icon.classList.add('icon-x');
    icon.classList.remove('icon-check');
    icon.textContent = 'Not compiled';
  }
};

IconView.prototype.destroy = function() {
  return this.detach();
};

module.exports = IconView;
