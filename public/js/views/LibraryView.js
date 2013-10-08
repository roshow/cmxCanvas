//public/js/views/LibraryView.js

define([
  'jquery',
  'underscore',
  'backbone',
  'jade',
  'bootstrap',
  //'models/',
  //'collections/CmxCollection'
  ], function($, _, Backbone, jade, bootstrap) {

    var LibraryView = Backbone.View.extend({
    
        el: $('#cmx.container'),

        initialize: function() {
            console.log('new LibraryView initializing')
        },

        render: function(model) {
            this.$el.html(jade.templates['library'](model));
        },

        events: {
            //'click #thought': 'newThought'
        }

    });

    return LibraryView;
});