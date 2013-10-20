//public/js/views/NavView.js
/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'jade',
  'bootstrap'
], function($, _, Backbone, jade, bootstrap) {
    NavView = Backbone.View.extend({
        el: $('#MAIN'),
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(jade.templates['index']());
        },
        events: {
            'click li.libNav': 'goToLibrary',
            'click .col-sm-4.issueEntry': 'goToComic'
        },
        goToLibrary: function(e){
            $('li.libNav').addClass('active');
            window.location.href='/#';
        },
        goToComic: function(e){
            $('li.libNav').removeClass('active');
        }
    });

    return NavView;
});