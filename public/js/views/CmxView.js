/* public/js/views/CmxView.js */

define([ 'jquery', 'underscore', 'backbone', 'jade', 'bootstrap', 'modules/CmxCanvasClass'
  ], function($, _, Backbone, jade, bootstrap, CmxCanvas) {

  
  var CmxView = Backbone.View.extend({
    el: $("#CmxCanvas"),

    initialize: function() {
      this.model = this.options.model;
    },
    render: function() {
      //@ Checks to see if it's a touch device and adds the appropriate class to the html dom element.
      ('ontouchstart' in document.documentElement) ? $('html').addClass('touchIs') : $('html').addClass('touchIsNot');
      var _modeljson = this.model.toJSON();
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
          // console.log("touchmove");
          break;
      }
    },
    rightArrow: function(e){
      var _read = this.cmxcanvas.goToNext();

      /**
          See comment in this.leftArrow
      **/

      if(_read) {
        $('#toc li').removeClass('active');
        $('#toc' + _read[0].curr).addClass('active');
        if (_read[0].isLast && _read[1].isLast) $('#rightbutton .ui-arrow').hide();
        if (!_read.isFirst) $('#leftbutton .ui-arrow').show();
      }
    },

    leftArrow: function(e){
      var _read = this.cmxcanvas.goToPrev();
      // console.log('left arrow');

      /**
          The if/then here and this.rightArrow should really be dealt with in 
          the CmxCanvas module by returning something more useful than the 
          panel/popup counter or false.
      **/

      if(_read) {
        $('#toc li').removeClass('active');
        $('#toc' + _read[0].curr).addClass('active');
        if (_read[0].isFirst) $('#leftbutton .ui-arrow').hide();
        $('#rightbutton .ui-arrow').show();
      }
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