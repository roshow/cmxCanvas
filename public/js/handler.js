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

    var handler = {

        loadView: function(V, o) {
            if(!this.navView) {
                this.navView = new NavView();
            } 
            clearCurrentView(this.currentView);
            this.currentView = new V(o);
            this.currentView.render();
        },
        readComic: function(id) {
            var that = this;
            this.model = new CmxIssueModel({id: id});
            this.model.fetch({
                success: function(m, r, o){
                    that.loadView(CmxView, {model: m});
                }
            });
        },
        loadLibrary: function(){
            var that = this;
            this.collection = new CmxCollection();
            this.collection.fetch({
                success: function(c, r, o){
                    that.loadView(LibraryView, {collection: c});
                }
            });
        }
    };

    return handler;

});
  