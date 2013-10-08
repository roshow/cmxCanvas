//public/js/views/LibraryView.js

define([
  'jquery',
  'underscore',
  'backbone',
  'jade',
  'bootstrap'
  ], function($, _, Backbone, jade, bootstrap) {

    var LibraryView = Backbone.View.extend({
    
        el: $('#CmxCanvas'),

        initialize: function() {
            this.collection = this.options.collection
        },

        render: function() {
            var _collectionJSON = this.collection.toJSON();
            this.$el.html(jade.templates['library']({issues: _collectionJSON}));
        },

        events: {
            //'click #thought': 'newThought'
        }

    });

    return LibraryView;
});