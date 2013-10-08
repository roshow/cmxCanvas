//public/js/collections/CmxCollection.js

define([
  'underscore',
  'backbone',
  'models/CmxIssueModel'
], function(_, Backbone, CmxIssueModel){

  var CmxCollection = Backbone.Collection.extend({
      
      model: CmxIssueModel,

      initialize : function(models, options) {
        
      },
      
      url : function() {
        return '/';
      },       
     
  });

  return CmxCollection;

});