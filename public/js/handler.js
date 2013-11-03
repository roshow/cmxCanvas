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
                    L = m.attributes.cmxJSON.length;
                    for(i = 0; i < L; i++) {
                        m.attributes.cmxJSON[i].src = m.attributes.img.url + m.attributes.cmxJSON[i].src;
                        if(m.attributes.cmxJSON[i].popups && m.attributes.cmxJSON[i].popups.length > 0) {
                            var L2 = m.attributes.cmxJSON[i].popups.length;
                            for(j = 0; j < L2; j++) {
                                m.attributes.cmxJSON[i].popups[j].src = m.attributes.img.url + m.attributes.cmxJSON[i].popups[j].src;
                            }
                        }
                    }
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
  