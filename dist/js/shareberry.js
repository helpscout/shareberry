(function() { 'use strict';

  var VERSION = '0.0.3';

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
    this.type = 'text';
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

    if (this.options.el.tagName.toLowerCase() === 'img') {
      this.type = 'image';
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

    this.content = document.createElement('div');
    this.content.classList.add(this.options.className + '-content');

    // Add tag specific class for CSS targeting
    var elTag = this.options.el.tagName;
    if (elTag) {
      elTag = elTag.toLowerCase();
      this.content.classList.add(this.options.className + '-content--' + elTag);
    }

    // Inject into the DOM
    this.options.el.parentNode.insertBefore(this.el, this.options.el);
    this.el.appendChild(this.content);
    this.content.appendChild(this.options.el);
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
   * getText
   * description: Get the text for sharing
   * return: string
   */
  ShareberryItem.prototype.getText = function(handle) {
    var text = this.collection.options.text;

    if (this.type === 'text') {
      text = this.options.el.innerText;
    }


    // Verify text length
    // 115 is the approx threshold of text + handle with a shortened URL for Twitter's 160 max character limit
    if ((text.length + handle.length) > 109) {
      text = text.substring(0, (109 - handle.length));
      text += '…';
    }

    text = text ? text : window.document.title;
    text = encodeURIComponent(text);

    return text;
  };


  /**
   * getUrl
   * description: Get the url for sharing
   * return: string
   */
  ShareberryItem.prototype.getUrl = function() {
    var url = this.collection.options.url;
    url = url ? url : window.location.href;
    url = encodeURIComponent(url);

    return url;
  };


  /**
   * getParams
   * description: Get params for sharing
   * return: object
   */
  ShareberryItem.prototype.getParams = function(handle) {
    // Params
    handle = handle ? handle : false;
    var text = this.getText(handle);
    var url = this.getUrl();

    url = 'https://pinkflamingo.helpscout.net/blog/product-managers/blog/product-managers/blog/product-managers/blog/product-managers/blog/product-managers/';

    // Calibrate the size / position of popup window
    var width = this.options.popup.width;
    var height = this.options.popup.height;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height);

    var params = {
      text: text,
      url: url,
      handle: handle,
      window: {
        width: width,
        height: height,
        left: left,
        top: top
      }
    };

    return params;
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

    var params = this.getParams(handle);
    var attributes = '';

    attributes += 'width=' + params.window.width + ',';
    attributes += 'height=' + params.window.height + ',';
    attributes += 'left=' + params.window.left + ',';
    attributes += 'top=' + params.window.top;

    var url = 'https://twitter.com/intent/tweet?url=' + params.url + '&text=' + params.text + '&via=' + params.handle;

    // Open popup window
    window.open(url, '', attributes);

    return this;
  };


  /**
   * Shareberry
   * description: Class constructor
   * return: class
   */
  var Shareberry = function(options) {
    this._extend = _extend;

    this.version = VERSION;

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


  // Exporting Shareberry to global
  window.Shareberry = Shareberry;

  // Exporting Shareberry
  return Shareberry;
})();
