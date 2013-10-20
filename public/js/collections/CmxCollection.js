//public/js/collections/CmxCollection.js

define([
  'underscore',
  'backbone',
  'models/CmxIssueModel'
], function(_, Backbone, CmxIssueModel){

  var CmxCollection = Backbone.Collection.extend({
      
      model: CmxIssueModel,

      initialize : function(models, options) {
        console.log('initializing CmxCollectionsss');
      },
      
      url : function() {
        return '/getallcmx';
      },       
     
  });

  return CmxCollection;

});