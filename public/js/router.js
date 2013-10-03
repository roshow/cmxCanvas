//public/js/router.js

define([
  'jquery',
  'underscore',
  'backbone',
  'models/CmxIssueModel'
], function($, _, Backbone, CmxIssueModel) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      'seejson/:id': 'seeJSON',
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function(){

    var app_router = new AppRouter;

    app_router.on('route:defaultAction', function (action) {
        console.log('routing defaultAction');
        console.log('default action!!!');
    });
    app_router.on('route:seeJSON', function (id) {
        var cmxmodel = new CmxIssueModel({ id: id});
        console.log(cmxmodel);
        cmxmodel.fetch({
          success: function(model, response, options) {
            console.log(model);
          }
        });
    });

    /*app_router.on('route:id', function (id) {
        var batView = new BatView({ id: id});
    });*/

    Backbone.history.start();
  
  };
  return { 
    initialize: initialize
  };
});