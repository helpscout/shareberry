(function() { 'use strict';

  /**
   * Shareberry
   * description: Class constructor
   * return: class
   */
  var Shareberry = function(options) {
    // Default attributes
    this.options = {
      className: 'hs-shareberry',
      el: false,
      twitter: false
    };

    this.els = [];
    this.shares = [];

    return this.initialize(options);
  };


  /**
   * _extend
   * description: Vanilla JS solution to jQuery's extend
   * source: http://youmightnotneedjquery.com/#extend
   * return: object
   */
  Shareberry.prototype._extend = function(output) {
    output = output || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          output[key] = arguments[i][key];
      }
    }
    return output;
  };


  /**
   * initialize
   * description: Initializes the Class
   * return: class
   */
  Shareberry.prototype.initialize = function(options) {
    // Debug
    console.log('Shareberry initialized');

    if (options && typeof options === 'object') {
      this.options = this._extend(this.options, options);
    }

    // Element query is required for Shareberry to work
    if (!this.options.el || typeof this.options.el !== 'string' ) {
      return false;
    }

    // Setting the elements
    this.els = Array.prototype.slice.call(document.querySelectorAll(this.options.el));

    this.render();

    console.log(this);
    return this;
  };


  /**
   * getTemplate
   * description: Creates the Shareberry DOM element
   * return: DOM element
   */
  Shareberry.prototype.getTemplate = function() {
    var el = document.createElement('div');
    el.classList.add(this.options.className);
    return el;
  };

  /**
   * render
   * description: Renders the Shareberry wrappers in the DOM
   * return: class
   */
  Shareberry.prototype.render = function() {
    if (!this.els) {
      return false;
    }

    this.els.forEach(function(el) {
      var parent = el.parentNode;
      var template = this.getTemplate();

      el.parentNode.insertBefore(template, el);
      template.appendChild(el);

      this.shares.push(template);
    }, this);

    this.renderShares();

    return this;
  };

  /**
   * renderShares
   * description: Renders the sharing elements into the DOM
   * return: class
   */
  Shareberry.prototype.renderShares = function() {
    if (!this.shares) {
      return false;
    }

    this.shares.forEach(function(el) {

      var className = this.options.className + '-share__item';
      var iconClassName = this.options.className + '-icon';
      var share = document.createElement('div');
      var template = '';

      share.classList.add(this.options.className + '-share');

      if (this.options.twitter) {
        template += '<div class="' + className + ' ' + className + '--twitter" data-shareberry-twitter="' + this.options.twitter + '"><i class="' + iconClassName + ' ' + iconClassName + '--twitter"></i></div>';
      }

      share.innerHTML = template;

      el.insertBefore(share, el.firstChild);
    }, this);

    return this;
  };

  // Exporting Shareberry to global
  window.Shareberry = Shareberry;

  // Exporting Shareberry
  return Shareberry;
})();
