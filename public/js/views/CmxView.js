//public/js/views/CmxView.js

define([
  'jquery',
  'underscore',
  'backbone',
  'jade',
  'bootstrap',
  'models/CmxIssueModel',
], function($, _, Backbone, jade, bootstrap, CmxIssueModel) {

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
          that.$el.html(jade.templates['cmxreader'](that.model.toJSON()));
        }
      });
    },

    events: {
      'click .moreinfoBtn': 'toggleMoreInfo'
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