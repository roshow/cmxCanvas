//public/js/router.js

define([
  'jquery',
  'underscore',
  'backbone',
  'handler',
  'views/NavView'
], function($, _, Backbone, handler, NavView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      'comic/:id': 'readComic',
      'library': 'loadLibrary',
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){

    var app_router = new AppRouter;

    app_router.on('route:defaultAction', function(action) {
        //handler.defaultAction(action);
        handler.loadLibrary();
    });
    app_router.on('route:loadLibrary', function() {
        handler.loadLibrary();
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