//public/js/router.js

define([
  'jquery',
  'underscore',
  'backbone',
  'models/CmxIssueModel',
  'views/CmxView'
], function($, _, Backbone, CmxIssueModel, CmxView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      'seejson/:id': 'seeJSON',
      '*actions': 'defaultAction'
    }
  });
  

  var currentView;

  function clearCurrentView(v) {
    if (v) {
      v.$el.empty();
      v.undelegateEvents();
    }
  }

  var initialize = function(){

    var app_router = new AppRouter;

    app_router.on('route:defaultAction', function (action) {
        console.log('routing defaultAction');
        console.log('default action!!!');
    });
    app_router.on('route:seeJSON', function (id) {
        clearCurrentView(currentView);
        currentView = new CmxView({cmxID: id});
        currentView.render();
    });

    Backbone.history.start();
  
  };
  return { 
    initialize: initialize
  };
});