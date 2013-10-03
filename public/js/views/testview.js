//public/js/views/testview.js

define([
  'jquery',
  'underscore',
  'backbone',
  'jade',
  'bootstrap',
  'models/CmxIssueModel',
], function($, _, Backbone, jade, bootstrap, CmxIssueModel) {

  var TestView = Backbone.View.extend({
    el: $("#page.container"),

    defaults: {
      "img": {},
      "credit": {}
    },

    initialize: function() {

      this.model = new 
    },

    render: function(model) {
      
    }

  return TestView;

});