define([
  'jquery',
  'underscore',
  'backbone',
  'views/CmxView',
  //'views/LibraryView',
  'models/CmxIssueModel'
], function($, _, Backbone, CmxView, CmxIssueModel) {
    var currentView;

    function clearCurrentView(v) {
        if (v) {
            v.$el.empty();
            v.undelegateEvents();
        }
    }

    function loadView(V, m) {
        clearCurrentView(currentView);
        currentView = new V({model: m});
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
                    loadView(CmxView, m);
                }
            });
        },
        loadLibrary: function(){
            //this.collection = new;
        }
    };

    return handler;

});
  