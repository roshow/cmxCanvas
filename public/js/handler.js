define([
  'jquery',
  'underscore',
  'backbone',
  'views/CmxView',
  'views/LibraryView',
  'collections/CmxCollection',
  'models/CmxIssueModel'
], function($, _, Backbone, CmxView, LibraryView, CmxCollection, CmxIssueModel) {
    var currentView;

    function clearCurrentView(v) {
        if (v) {
            v.$el.empty();
            v.undelegateEvents();
        }
    }

    function loadView(V, o) {
        clearCurrentView(currentView);
        currentView = new V(o);
        currentView.render();
    }

    var handler = {


        defaultAction: function(action) {
            console.log('routing defaultAction');
            console.log('action: ' + action);
        },
        readComic: function(id) {
            this.model = new CmxIssueModel({id: id});
            this.model.fetch({
                success: function(m, r, o){
                    loadView(CmxView, {model: m});
                }
            });
        },
        loadLibrary: function(){
            this.collection = new CmxCollection();
            this.collection.fetch({
                success: function(c, r, o){
                    loadView(LibraryView, {collection: c});
                }
            });
        }
    };

    return handler;

});
  