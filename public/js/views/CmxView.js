//public/js/views/CmxView.js
/*global define*/

define([ 'jquery', 'underscore', 'backbone', 'jade', 'bootstrap', 'modules/CmxCanvasClass', 'modules/ImagePreloader'
  ], function($, _, Backbone, jade, bootstrap, CmxCanvas) {

  function bulkPreload(Json, logtime) {
    logtime = true;
    Json = Json.cmxJSON;
    var bigLoad = new ImagePreloader();
    bigLoad.onLoadStart = function(){
      if (logtime) console.log('loading every image');
      this.start = new Date().getTime();
    };
    bigLoad.onLoadDone = function(){
      if (logtime) this.end = new Date().getTime();
      if (logtime) console.log('duration for every damn image load: ' + (this.end - this.start));
      delete bigLoad.loadedImages;
    };
    var L = Json.length;
    var _popupArr = [];
    for (var i = 0; i < L; i++) {
      //console.log(Json[i]);
      _popupArr = Json[i].popups ? _popupArr.concat(Json[i].popups) : _popupArr;
    }
    console.log("Total no. of images: " + (Json.length + _popupArr.length));
    bigLoad.load(Json.concat(_popupArr), true);
  }
  
  var CmxView = Backbone.View.extend({
    el: $("#CmxCanvas"),

    initialize: function() {
      this.model = this.options.model;
    },
    render: function() {
      //@ Checks to see if it's a touch device and adds the appropriate class to the html dom element.
      ('ontouchstart' in document.documentElement) ? $('html').addClass('touchIs') : $('html').addClass('touchIsNot');
      var _modeljson = this.model.toJSON();
      //bulkPreload(_modeljson);
      this.$el.html(jade.templates['cmxreader'](_modeljson));
      $('#leftbutton .ui-arrow').css('display', 'none');
      //create cmxcanvas class with methods to make life easier
      this.cmxcanvas = new CmxCanvas(_modeljson, 'cmx');
      //select first (0) panel in TOC
      $('#toc0').addClass('active');
    },
    events: {
      'click .moreinfoBtn': 'toggleMoreInfo',
      'click #leftbutton': 'leftArrow',
      'click #rightbutton': 'rightArrow',
      'click #toc li': 'tocPanelBtn',
      // 'touchmove #canvas_container': 'detectSwipe',  
      'touchstart #canvas_container': 'detectSwipe',      
      'touchend #canvas_container': 'detectSwipe'
    },
    detectSwipe: function(e) {
      e.preventDefault();
      var td = e.originalEvent;
      switch (td.type) {
        case "touchstart":
          this.touchstartX = td.changedTouches[0].pageX;
          break;
        case "touchend":
          var touchendX = td.changedTouches[0].pageX;
          var touchdiff = touchendX - this.touchstartX;
          if (Math.abs(touchdiff) > 75) {
            (touchdiff < 0) ? this.rightArrow() : this.leftArrow();
          }
          break;
        case "touchmove":
          console.log("touchmove");
          break;
      }
    },

    leftArrow: function(e){
      var _read = this.cmxcanvas.goToPrev();

      $('#toc li').removeClass('active');
      $('#toc' + _read[0].curr).addClass('active');
      
      if (_read[0].isFirst) $('#leftbutton .ui-arrow').hide();
      $('#rightbutton .ui-arrow').show();
    },
    rightArrow: function(e){
      var _read = this.cmxcanvas.goToNext();

      $('#toc li').removeClass('active');
      $('#toc' + _read[0].curr).addClass('active');

      if (_read[0].isLast && _read[1].isLast) $('#rightbutton .ui-arrow').hide();
      if (!_read.isFirst) $('#leftbutton .ui-arrow').show();
    },
    tocPanelBtn: function(e){
      var _panel = parseInt($(e.currentTarget).attr('panelNum'), 10);
      this.cmxcanvas.goToPanel(_panel);
      $('#toc li').removeClass('active');
      $('#toc' + _panel).addClass('active');
    },
    toggleMoreInfo: function() {
      if ($('#moreinfo').hasClass('open')) {
          $('#moreinfo').removeClass('open');
          $('.moreinfoBtn > span.caret').removeClass('reverse');
      }
      else {
          $('#moreinfo').addClass('open');
          $('.moreinfoBtn > span.caret').addClass('reverse');
      }
    }
  });

  return CmxView;

});