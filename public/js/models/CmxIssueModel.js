//public/js/models/CmxIssueModel.js

define([
  'underscore',
  'backbone',
], function(_, Backbone) {

  var CmxIssueModel = Backbone.Model.extend({
      initialize : function() {
      },
          
      urlRoot: '/getcmxjson'
  });

  return CmxIssueModel;

});