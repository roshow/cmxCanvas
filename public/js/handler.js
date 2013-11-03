/*global document, makeEaseOut, back, linear, jsAnimate, Image, $*/
/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'views/CmxView',
  'views/LibraryView',
  'collections/CmxCollection',
  'models/CmxIssueModel'
], function($, _, Backbone, CmxView, LibraryView, CmxCollection, CmxIssueModel) {
    var currentView, i, j;

    //// HELPERS, I guess ////
    function resolveImgUrlsFromModel(model) {
        var L1 = model.cmxJSON.length;
        for(i = 0; i < L1; i++) {
            model.cmxJSON[i].src = model.img.url + model.cmxJSON[i].src;
            if(model.cmxJSON[i].popups && model.cmxJSON[i].popups.length > 0) {
                var L2 = model.cmxJSON[i].popups.length;
                for(j = 0; j < L2; j++) {
                    model.cmxJSON[i].popups[j].src = model.img.url + model.cmxJSON[i].popups[j].src;
                }
            }
        }
        return model;
    }
    //// END HELPERS ////

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
                    m.attributes = resolveImgUrlsFromModel(m.attributes);
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
  