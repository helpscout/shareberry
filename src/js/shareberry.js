(function() { 'use strict';

  /**
   * _extend
   * description: Vanilla JS solution to jQuery's extend
   * source: http://youmightnotneedjquery.com/#extend
   * return: object
   */
  var _extend = function(output) {
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
   * ShareberryItem
   * description: Class constructor for an individual share item
   * return: class
   */
  var ShareberryItem = function(options) {
    this._extend = _extend;

    // Default attributes
    this.options = {
      className: null,
      el: false,
      collection: false,
      popup: {
        width: 640,
        height: 300
      }
    };

    this.el = false;
    this.share = false;

    return this.initialize(options);
  };


  /**
   * initialize
   * description: Initialization for a Shareberry item
   * return: class
   */
  ShareberryItem.prototype.initialize = function(options) {
    if (options && typeof options === 'object') {
      this.options = this._extend(this.options, options);
    }

    if (!this.options.el) {
      return false;
    }

    if (!this.options.collection) {
      return false;
    }

    this.collection = this.options.collection;

    this.render();

    return this;
  };


  /**
   * actions
   * description: Setups events for the Shareberry unit
   * return: class
   */
  ShareberryItem.prototype.addEventListeners = function() {
    if (!this.el) {
      return false;
    }

    this.share.addEventListener('click', this.actionShare.bind(this), false);

    return this;
  };


  /**
   * render
   * description: Renders the sharing elements into the DOM
   * return: class
   */
  ShareberryItem.prototype.render = function() {
    if (!this.options.el) {
      return false;
    }

    // Creating the share wrapper
    this.el = document.createElement('div');
    this.el.classList.add(this.options.className);

    // Creating the share element
    var className = this.options.className + '-share__item';
    var iconClassName = this.options.className + '-icon';

    this.share = document.createElement('div');
    var template = '';

    this.share.classList.add(this.options.className + '-share');

    if (this.collection.options.twitter) {
      template += '<div class="' + className + ' ' + className + '--twitter" data-shareberry-social="twitter" data-shareberry-handle="' + this.collection.options.twitter + '"><i class="' + iconClassName + ' ' + iconClassName + '--twitter"></i></div>';
    }

    this.share.innerHTML = template;

    // Inject into the DOM
    this.options.el.parentNode.insertBefore(this.el, this.options.el);
    this.el.appendChild(this.options.el);
    this.el.insertBefore(this.share, this.el.firstChild);

    this.addEventListeners();

    return this;
  };


  /**
   * getClickTarget
   * description: Determines if the click action was on the share icon
   * return: DOM element
   */
  ShareberryItem.prototype.getClickTarget = function(event) {
    var target = event.target;

    if (target.classList.contains(this.options.className + '-share')) {
      return false;
    }

    // Reassign target if the icon is clicked
    if (target.classList.contains(this.options.className + '-icon')) {
      target = target.parentNode;
    }

    return target;
  };


  /**
   * actionShare
   * description: The share action that happens after a click event
   * return: class
   */
  ShareberryItem.prototype.actionShare = function(event) {
    var target = this.getClickTarget(event);

    if (!target) {
      return false;
    }

    var social = target.getAttribute('data-shareberry-social');
    var handle = target.getAttribute('data-shareberry-handle');

    this.renderPopup(social, handle);
  };


  /**
   * renderPopup
   * description: Launches the popup window
   * return: class
   */
  ShareberryItem.prototype.renderPopup = function(social, handle) {
    if (
        !social ||
        !handle ||
        typeof social !== 'string' ||
        typeof handle !== 'string') {
      return false;
    }

    // Calibrate the size / position of popup window
    var width = this.options.popup.width;
    var height = this.options.popup.height;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height);
    var params = '';

    params += 'width=' + width + ',';
    params += 'height=' + height + ',';
    params += 'left=' + left + ',';
    params += 'top=' + top;

    // DEBUG:
    var url = 'https://twitter.com/intent/tweet?text=Is%20Your%20Business%20Ready%20for%20Facebook%20Live%3F&url=http%3A%2F%2Fwistia.com%2Fblog%2Ffacebook-live-for-business&via=wistia';

    window.open(url, '', params);

    return this;
  };


  /**
   * Shareberry
   * description: Class constructor
   * return: class
   */
  var Shareberry = function(options) {
    this._extend = _extend;

    // Default attributes
    this.options = {
      className: 'hs-shareberry',
      el: false,
      twitter: false
    };

    this.ShareberryItem = ShareberryItem;

    this.els = [];
    this.shares = [];

    return this.initialize(options);
  };


  /**
   * initialize
   * description: Initializes the Class
   * return: class
   */
  Shareberry.prototype.initialize = function(options) {
    if (options && typeof options === 'object') {
      this.options = this._extend(this.options, options);
    }

    // Element query is required for Shareberry to work
    if (!this.options.el || typeof this.options.el !== 'string' ) {
      return false;
    }

    var els = document.querySelectorAll(this.options.el);
    if (!els || !els.length) {
      return false;
    }

    for (var i = 0, len = els.length; i < len; i++) {
      var share = new this.ShareberryItem({
        className: this.options.className,
        el: els[i],
        collection: this
      });
      this.shares.push(share);
    }

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

  // Exporting Shareberry to global
  window.Shareberry = Shareberry;

  // Exporting Shareberry
  return Shareberry;
})();
