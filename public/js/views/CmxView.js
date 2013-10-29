//public/js/views/CmxView.js
/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'jade',
  'bootstrap',
  'modules/CmxCanvasClass'
], function($, _, Backbone, jade, bootstrap, CmxCanvas) {

  var CmxView = Backbone.View.extend({
    el: $("#CmxCanvas"),

    initialize: function() {
      this.model = this.options.model;
    },

    render: function() {

      var _modeljson = this.model.toJSON();
      this.$el.html(jade.templates['cmxreader'](_modeljson));
      $('#leftbutton .ui-arrow').css('display', 'none');
      //create cmxcanvas class with methods to make life easier
      this.cmxcanvas = new CmxCanvas(_modeljson, 'cmxcanvas');
      //select first (0) panel in TOC
      $('#toc0').addClass('active');
    },

    events: {
      'click .moreinfoBtn': 'toggleMoreInfo',
      'click #leftbutton': 'leftArrow',
      'click #rightbutton': 'rightArrow',
      'click #toc li': 'tocPanelBtn'
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
      $('#toc' + _read.curr).addClass('active');
      if (_read[0].curr === _read[0].last - 1) $('#rightbutton .ui-arrow').hide();
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