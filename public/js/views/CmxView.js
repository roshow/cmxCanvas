//public/js/views/CmxView.js
/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'jade',
  'bootstrap',
  'models/CmxIssueModel',
  'modules/CmxCanvasClass'
], function($, _, Backbone, jade, bootstrap, CmxIssueModel, CmxCanvas) {

  var CmxView = Backbone.View.extend({
    el: $("#CmxCanvas"),

    initialize: function() {
      //console.log(this);
    },

    render: function() {
      
      var that = this;

      this.model = new CmxIssueModel({id: that.options.cmxID});
      this.model.fetch({  
        success: function(model, response, options) {

          var _modeljson = that.model.toJSON();
          //load templates
          that.$el.html(jade.templates['cmxreader'](_modeljson));
          //create cmxcanvas class with methods to make life easier
          
          that.cmxcanvas = new CmxCanvas(_modeljson, 'cmxcanvas');
          //select first (0) panel in TOC
          $('#toc0').addClass('active');
        }
      });
    },

    events: {
      'click .moreinfoBtn': 'toggleMoreInfo',
      'click #leftbutton': 'leftArrow',
      'click #rightbutton': 'rightArrow',
      'click #toc li': 'tocPanelBtn'
    },

    leftArrow: function(e){
      var _panel = this.cmxcanvas.goToPrev();
      $('#toc li').removeClass('active');
      $('#toc' + _panel).addClass('active');
    },
    rightArrow: function(e){
      var _panel = this.cmxcanvas.goToNext();
      $('#toc li').removeClass('active');
      $('#toc' + _panel).addClass('active');
    },
    tocPanelBtn: function(e){
      //console.log(e.currentTarget);
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