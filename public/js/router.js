//public/js/router.js

define([
  'jquery',
  'underscore',
  'backbone',
  'handler'
], function($, _, Backbone, handler) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      'comic/:id': 'readComic',
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){

    var app_router = new AppRouter;

    app_router.on('route:defaultAction', function(action) {
        handler.defaultAction(action);
    });
    app_router.on('route:readComic', function(id) {
        handler.readComic(id);
    });

    Backbone.history.start();
  
  };
  return { 
    initialize: initialize
  };
});